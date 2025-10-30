import os

# ====== BURAYI KENDİ URL'İNLE DÜZENLE ======
BASE_URL = "https://materyalfabrikasi.github.io/ses/"

# ====== ÇIKTI DOSYASI ======
OUTPUT = "linkinizBurada.txt"

# Eski dosya varsa sil
if os.path.exists(OUTPUT):
    os.remove(OUTPUT)

print("Dosyalar listeleniyor...")

# Geçerli dizini al
current_dir = os.getcwd()

# Dosyaları tara
with open(OUTPUT, "w", encoding="utf-8") as outfile:
    for root, _, files in os.walk(current_dir):
        for filename in files:
            full_path = os.path.join(root, filename)
            # Göreli yol (current_dir'den itibaren)
            rel_path = os.path.relpath(full_path, current_dir)
            # Windows '\' karakterlerini '/' ile değiştir
            rel_path = rel_path.replace("\\", "/")
            # URL oluştur
            url = f"{BASE_URL}{rel_path}"
            outfile.write(url + "\n")

print(f"\nİşlem tamamlandı: {OUTPUT}")
