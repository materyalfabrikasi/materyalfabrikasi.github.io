import os
import re

# Türkçe karakterleri temizlemek için fonksiyon
def temizle_dosya_ve_klasor_adini(ad):
    # Türkçe karakterleri kaldır ve diğer özel karakterleri temizle
    ad = ad.replace('ı', 'i').replace('İ', 'i').replace('ğ', 'g').replace('Ğ', 'g')
    ad = ad.replace('ş', 's').replace('Ş', 's').replace('ü', 'u').replace('Ü', 'u')
    ad = ad.replace('ö', 'o').replace('Ö', 'o').replace('ç', 'c').replace('Ç', 'c')
    ad = ad.replace('ı', 'i')  # Küçük 'ı' harfini 'i' ile değiştir
    ad = ad.strip()  # Başlangıç ve bitişteki boşlukları temizle
    # Boşlukları alt çizgi (_) ile değiştir, ancak nokta ve diğer dosya uzantıları korunur
    ad = re.sub(r'[^\w\s.-]', '', ad)  # Nokta, tire ve harf/dijit dışı karakterleri temizler
    ad = re.sub(r'\s+', '_', ad)  # Birden fazla boşlukları alt çizgiyle değiştir
    return ad

# Klasördeki ve alt klasörlerdeki tüm dosya ve klasör isimlerini temizleyip yeniden adlandırma
def klasordeki_dosya_ve_klasorları_temizle(klasor_yolu):
    try:
        # Klasördeki tüm dosyaların ve klasörlerin listesini al
        for root, dirs, files in os.walk(klasor_yolu, topdown=False):  # alt klasörler de dahil olsun diye bottom-up yöntemi kullanıyoruz
            # Dosyaları adlandır
            for dosya_adı in files:
                dosya_yolu = os.path.join(root, dosya_adı)
                yeni_dosya_adi = temizle_dosya_ve_klasor_adini(dosya_adı)
                yeni_dosya_yolu = os.path.join(root, yeni_dosya_adi)

                # Dosya ismini yeniden adlandır
                os.rename(dosya_yolu, yeni_dosya_yolu)
                print(f"{dosya_adı} -> {yeni_dosya_adi}")

            # Klasörleri adlandır
            for klasor_adı in dirs:
                klasor_yolu = os.path.join(root, klasor_adı)
                yeni_klasor_adi = temizle_dosya_ve_klasor_adini(klasor_adı)
                yeni_klasor_yolu = os.path.join(root, yeni_klasor_adi)

                # Klasör ismini yeniden adlandır
                os.rename(klasor_yolu, yeni_klasor_yolu)
                print(f"{klasor_adı} -> {yeni_klasor_adi}")

        print("Tüm dosya ve klasör isimleri başarıyla temizlendi.")

    except Exception as e:
        print(f"Hata oluştu: {e}")

# Örnek kullanım
klasor_yolu = "./"  # Temizlenecek dosyaların bulunduğu klasörün yolu
klasordeki_dosya_ve_klasorları_temizle(klasor_yolu)
