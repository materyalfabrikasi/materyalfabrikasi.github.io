import os
from PIL import Image

klasor_yolu = "./preview"  # değiştir

def png_to_jpg_ve_sil(root_path):
    for root, dirs, files in os.walk(root_path):
        for dosya in files:
            if dosya.lower().endswith(".png"):
                png_yolu = os.path.join(root, dosya)
                jpg_dosya_adi = os.path.splitext(dosya)[0] + ".jpg"
                jpg_yolu = os.path.join(root, jpg_dosya_adi)

                try:
                    with Image.open(png_yolu) as img:
                        rgb_img = img.convert("RGB")
                        rgb_img.save(jpg_yolu, "JPEG", quality=95)

                    os.remove(png_yolu)  # PNG'yi sil
                    print(f"Dönüştürüldü ve silindi: {png_yolu}")

                except Exception as e:
                    print(f"Hata: {png_yolu} -> {e}")


def html_icini_guncelle(root_path):
    for root, dirs, files in os.walk(root_path):
        for dosya in files:
            if dosya.lower().endswith(".html"):
                html_yolu = os.path.join(root, dosya)

                try:
                    with open(html_yolu, "r", encoding="utf-8") as f:
                        icerik = f.read()

                    # .png uzantılarını .jpg yap
                    yeni_icerik = icerik.replace(".png", ".jpg").replace(".PNG", ".jpg")

                    with open(html_yolu, "w", encoding="utf-8") as f:
                        f.write(yeni_icerik)

                    print(f"Güncellendi: {html_yolu}")

                except Exception as e:
                    print(f"Hata (HTML): {html_yolu} -> {e}")


# Çalıştır
png_to_jpg_ve_sil(klasor_yolu)
html_icini_guncelle(klasor_yolu)

print("Tüm işlemler tamamlandı.")