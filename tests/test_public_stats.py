import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location("stats", Path(__file__).resolve().parents[1] / "scripts/export-material-stats.py")
stats = importlib.util.module_from_spec(spec)
spec.loader.exec_module(stats)


def report(rows=(), metadata=None):
    return {
        "dimensionHeaders": [{"name": "customEvent:material_id"}, {"name": "eventName"}],
        "metricHeaders": [{"name": "eventCount"}],
        "metadata": metadata or {},
        "rows": [{"dimensionValues": [{"value": key}, {"value": event}],
                  "metricValues": [{"value": count}]} for key, event, count in rows],
    }


class PublicStatsTests(unittest.TestCase):
    def test_sums_pages_and_fills_true_zero_counts(self):
        result = stats.aggregate([
            report([("1", "material_preview", "1234"), ("2", "material_download", "7")]),
            report([("1", "material_download", "3")]),
        ], ["1", "2", "3"])
        self.assertEqual(result["1"], {"previews": 1234, "downloads": 3})
        self.assertEqual(result["2"], {"previews": 0, "downloads": 7})
        self.assertEqual(result["3"], {"previews": 0, "downloads": 0})

    def test_empty_valid_report(self):
        self.assertEqual(stats.aggregate([report()], ["1"])["1"]["previews"], 0)

    def test_rejects_incomplete_reports(self):
        for metadata in ({"subjectToThresholding": True}, {"dataLossFromOtherRow": True}, {"samplingMetadatas": [{}]}):
            with self.assertRaises(ValueError):
                stats.aggregate([report(metadata=metadata)], ["1"])

    def test_rejects_bad_counts_or_unknown_ids(self):
        for row in [("1", "material_preview", "-1"), ("1", "material_preview", "1.5"),
                    ("1", "material_preview", str(2**53)), ("(not set)", "material_download", "4")]:
            with self.assertRaises(ValueError):
                stats.aggregate([report([row])], ["1"])

    def test_catalog_ids_are_unique(self):
        ids = stats.material_ids((stats.ROOT / "index.html").read_text())
        self.assertGreater(len(ids), 0)
        self.assertEqual(len(ids), len(set(ids)))


if __name__ == "__main__":
    unittest.main()
