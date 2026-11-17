# Herkese açık materyal sayaçları

Kartlar, `data/material-stats.json` dosyasından önizleme ve indirme toplamlarını okur.
Gerçek rapor yokken `—` görünür. Sahte başlangıç verisi veya tarayıcıya özel sayaç kullanılmaz.
SCORM, PDF ve sunum indirmeleri tek indirme toplamında birleşir.
Sayılar tekil kişi sayısı değil, Analytics'in ölçtüğü işlemlerin toplamıdır.
İndirme, dosyanın kaydedildiğinin doğrulaması değildir. Reklam engelleyiciler gibi nedenlerle
ölçülemeyen işlemler sayıya dahil olmaz.

## Bir defalık kurulum

1. Google Analytics → Yönetici → Özel tanımlar bölümünde olay kapsamlı özel boyut oluşturun:
   ad `Materyal Kimliği`, olay parametresi `material_id`. Boyutun raporlara işlenmesi zaman alabilir;
   oluşturulmadan önceki işlemler materyal bazında geriye dönük doldurulmaz.
2. Google Analytics → Yönetici → Mülk ayrıntıları bölümündeki sayısal Mülk Kimliği'ni alın.
   Bu kimlik `G-Z7CF7M54CV` ölçüm kimliği veya web akışının kimliği değildir.
3. Google Cloud projesinde Google Analytics Data API'yi etkinleştirin. Bir hizmet hesabı oluşturun.
   Bu hesabın e-posta adresini Analytics mülk erişim yönetimine **Görüntüleyici** olarak ekleyin.
4. Hizmet hesabı için JSON anahtarı oluşturup doğrudan deponun
   Settings → Secrets and variables → Actions → Secrets bölümüne
   `GA_SERVICE_ACCOUNT_JSON` adıyla kaydedin. Anahtar dosyasını depoya veya sohbete eklemeyin.
5. Aynı ekrandaki Variables bölümüne şunları ekleyin:

   | Değişken | Değer |
   | --- | --- |
   | `GA_PROPERTY_ID` | Sayısal Analytics Mülk Kimliği |
   | `STATS_START_DATE` | Takip ve özel boyutun etkin olduğu ilk gün, `YYYY-MM-DD` biçiminde |
   | `PUBLIC_STATS_ENABLED` | `true` |

6. Bu paketteki dosyaları mevcut site dosyalarının yanına ekleyip main dalına gönderin.
   Eski materyal, resim, PDF, sunum ve önizleme dosyalarını koruyun.
7. Depo yöneticisi Settings → Pages → Build and deployment → Source alanında
   **GitHub Actions** seçsin. Mevcut başka özel yayın iş akışı varsa bu iş akışıyla
   birleştirin; aynı siteye iki ayrı yayın iş akışı çalıştırmayın.
8. Actions → Publish site with material counts → Run workflow ile ilk yayını başlatın.
   İlk ölçüm gününde site sayaçlar beklemede olarak yayımlanır. Sonraki günlerde özel boyut
   henüz raporlara hazır değilse yayın başarısız olabilir; Analytics hazır olduğunda tekrar çalıştırın.

GitHub depo ayarları ve Secrets/Pages işlemleri için depo yöneticisinin yardımı gerekebilir.
Yalnızca kod değişikliği için Write yetkisi yeterlidir; bu ek ayarlar ayrı yetkilere tabidir.

## İşleyiş

İş akışı Türkiye saatiyle her gün 09:23'te (GitHub kuyruğuna göre gecikebilir), main dalına
gönderimde ve elle çalıştırıldığında raporu alır. Dün dahil tüm dönem yeniden hesaplanır;
eski toplama ekleme yapılmadığından tekrar çalıştırma çift saymaz. Google Analytics'in
geç işlediği veriler sonraki çalışmada yansır. Kimlikler kalıcı olmalı; farklı materyaller
için eski `id` değerlerini yeniden kullanmayın.

Yalnızca materyal kimliği ve toplam sayılar yayımlanır. Anahtar, erişim token'ı ve ziyaretçi
bilgileri siteye gönderilmez. Rapor eksik/örneklenmişse veya API hata verirse yeni site
yayımlanmaz; mevcut yayın ve son başarılı sayaçlar korunur. Görünen tarih veri kapsamını gösterir.
GitHub Actions, hareketsiz herkese açık depolarda zamanlanmış çalışmaları devre dışı bırakabilir;
bu durumda Actions bölümünden tekrar etkinleştirin.

`PUBLIC_STATS_ENABLED` tanımlanmadan yeni iş akışı çalışmaz. Henüz bağlantı kurulmamış
statik sayfada sayaçlar `—` olarak kalır. Önceki takip kodu da henüz yayımlanmadıysa
veri toplama ancak güncellenmiş `index.html` yayına çıktığında başlar.

## Doğrulama

```sh
python3 -m unittest discover -s tests -p 'test_*.py'
node tests/public-stats-ui.cjs
```

İlk yayın sonrasında `/data/material-stats.json` adresindeki tarih ve toplamları kontrol edin.
Analytics gerçek zamanlı raporunda `material_preview` ve `material_download` olaylarını
doğrulayın. Bugünkü tıklamalar bugünkü statik sayaçta anında artmaz.

Kaynaklar:
- https://developers.google.com/analytics/devguides/reporting/data/v1/basics
- https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
