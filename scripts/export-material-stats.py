"""Publish aggregate GA4 counts only; credentials never enter the public JSON."""
import datetime as dt
import json
import os
from pathlib import Path
import re
import urllib.request
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
EVENTS = {"material_preview": "previews", "material_download": "downloads"}


def material_ids(html):
    catalog = html.split("const materials = [", 1)[1].split("let filteredMaterials", 1)[0]
    ids = re.findall(r"\bid:\s*(\d+)\s*,", catalog)
    if not ids or len(ids) != len(set(ids)):
        raise ValueError("Materyal kimlikleri eksik veya tekrarlı.")
    return ids


def aggregate(reports, ids):
    counts = {key: {"previews": 0, "downloads": 0} for key in ids}
    for report in reports:
        metadata = report.get("metadata", {})
        if metadata.get("subjectToThresholding") or metadata.get("dataLossFromOtherRow") or metadata.get("samplingMetadatas"):
            raise ValueError("Eksik/örneklenmiş Analytics raporu yayımlanmadı.")
        if [h["name"] for h in report.get("dimensionHeaders", [])] != ["customEvent:material_id", "eventName"]:
            raise ValueError("Analytics boyutları beklenen sırada değil.")
        if [h["name"] for h in report.get("metricHeaders", [])] != ["eventCount"]:
            raise ValueError("Analytics metriği beklenen biçimde değil.")
        for row in report.get("rows", []):
            key, event = [value["value"] for value in row["dimensionValues"]]
            raw = row["metricValues"][0]["value"]
            if key not in counts or event not in EVENTS:
                raise ValueError("Eşleştirilemeyen materyal/etkinlik. Kimlikleri kontrol edin.")
            if not re.fullmatch(r"\d+", raw):
                raise ValueError("Geçersiz etkinlik sayısı.")
            field = EVENTS[event]
            counts[key][field] += int(raw)
            if counts[key][field] > 2**53 - 1:
                raise ValueError("Sayaç güvenli sayı sınırını aştı.")
    return counts


def fetch_reports(property_id, token, start, end):
    reports = []
    offset = 0
    while True:
        query = {
            "dateRanges": [{"startDate": start, "endDate": end}],
            "dimensions": [{"name": "customEvent:material_id"}, {"name": "eventName"}],
            "metrics": [{"name": "eventCount"}],
            "dimensionFilter": {"andGroup": {"expressions": [
                {"filter": {"fieldName": "eventName", "inListFilter": {"values": list(EVENTS)}}},
                {"filter": {"fieldName": "hostName", "stringFilter": {
                    "matchType": "EXACT", "value": "materyalfabrikasi.github.io"}}},
            ]}},
            "orderBys": [{"dimension": {"dimensionName": "customEvent:material_id"}},
                         {"dimension": {"dimensionName": "eventName"}}],
            "limit": 10000, "offset": offset,
        }
        request = urllib.request.Request(
            f"https://analyticsdata.googleapis.com/v1beta/properties/{property_id}:runReport",
            data=json.dumps(query).encode(),
            headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        )
        with urllib.request.urlopen(request, timeout=60) as response:
            report = json.load(response)
        reports.append(report)
        row_count = report.get("rowCount", 0)
        page_size = len(report.get("rows", []))
        offset += page_size
        if offset >= row_count:
            return reports
        if page_size == 0:
            raise ValueError("Analytics sayfalaması tamamlanamadı.")


def main():
    property_id = os.environ.get("GA_PROPERTY_ID", "")
    start = os.environ.get("STATS_START_DATE", "")
    if not re.fullmatch(r"\d+", property_id):
        raise ValueError("GA_PROPERTY_ID sayısal Mülk Kimliği olmalıdır.")
    dt.date.fromisoformat(start)
    today = dt.datetime.now(ZoneInfo("Europe/Istanbul")).date()
    end = (today - dt.timedelta(days=1)).isoformat()
    if start > end:
        if start > today.isoformat():
            raise ValueError("Başlangıç tarihi gelecekte olamaz.")
        # Publish the tracking code on day one; don't invent counts before a full day exists.
        print("İlk ölçüm günü: site yayımlanacak; sayaçlar ilk raporu bekliyor.")
        return

    from google.oauth2 import service_account
    from google.auth.transport.requests import Request
    info = json.loads(os.environ["GA_SERVICE_ACCOUNT_JSON"])
    credentials = service_account.Credentials.from_service_account_info(
        info, scopes=["https://www.googleapis.com/auth/analytics.readonly"])
    credentials.refresh(Request())
    reports = fetch_reports(property_id, credentials.token, start, end)
    counts = aggregate(reports, material_ids((ROOT / "index.html").read_text()))
    snapshot = {
        "version": 1,
        "updatedAt": dt.datetime.now(dt.timezone.utc).isoformat(),
        "since": start, "throughDate": end, "materials": counts,
    }
    target = ROOT / "data/material-stats.json"
    target.parent.mkdir(exist_ok=True)
    temporary = target.with_suffix(".tmp")
    temporary.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2) + "\n")
    temporary.replace(target)
    print(f"{len(counts)} materyal için {end} tarihine kadar olan toplamlar hazır.")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        # Do not print credential objects, access tokens or HTTP response bodies.
        print(f"Sayaçlar güncellenemedi ({type(error).__name__}). Mevcut yayın korunuyor.")
        raise SystemExit(1)
