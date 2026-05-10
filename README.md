# Materyal Fabrikası - Türkçe ve Türk Kültürü

Bu proje, Türkçe ve Türk Kültürü dersi için hazırlanmış dijital eğitim materyallerini tek bir çatı altında toplayan ve kullanıcılara sunan etkileşimli bir web platformudur.

## Proje Hakkında
"Materyal Fabrikası", eğitimcilerin ve öğrencilerin eğitim materyallerine kolayca erişebilmesini sağlar. Kullanıcılar materyalleri; konu, tema, yaş grubu ve dil seviyesine göre filtreleyebilir veya doğrudan arama çubuğunu kullanarak aradıkları içeriklere ulaşabilirler. Her bir materyal için web üzerinden ön izleme yapma, PDF olarak indirme ve LMS (Öğrenme Yönetim Sistemleri) uyumlu SCORM paketi olarak indirme seçenekleri sunulmaktadır.

## Klasör ve Dosya Yapısı

Proje dizininde yer alan klasörler ve dosyaların işlevleri aşağıda detaylandırılmıştır:

### Ana Dosyalar
- **`index.html`**: Web sitesinin kalbidir. Kullanıcının gördüğü ana arayüzdür. Materyallerin listelenmesi, arama, filtreleme (Konu, Tema, Seviye, Yaş) ve materyal kartlarının (SCORM, PDF, Ön İzleme butonlarıyla birlikte) oluşturulması bu dosya üzerinden JS ve CSS ile gerçekleştirilir.
- **`scorm.html`**: Kullanıcıların dışarıdan aldıkları iframe (örneğin bir etkileşimli içerik) kodlarını kullanarak on-demand (anında) dinamik SCORM paketleri (`.zip`) oluşturmalarını sağlayan bir araçtır. 
- **`pngkiller.py`**: Proje klasörlerindeki (özellikle ön izleme dosyalarındaki) görsel boyutlarını optimize etmek için kullanılan bir Python scriptidir. Belirtilen klasördeki tüm `.png` uzantılı görselleri `.jpg` formatına dönüştürür, eski PNG dosyalarını siler ve ilgili HTML dosyaları içindeki dosya yolu referanslarını otomatik olarak günceller.

### Klasörler
- **`files/`**: Sistem için gerekli olan taban/şablon dosyaları barındırır. Dinamik SCORM oluşturma aracı (`scorm.html`) ve `index.html` tarafından kullanılan temel SCORM şablonu olan `default.zip` dosyası burada yer alır.
- **`icons/`**: Web sitesinde kullanılan `factory.ico` gibi favicon ve diğer ikon dosyalarını barındırır.
- **`pdf/`**: Sistemde yer alan tüm eğitim materyallerinin (.pdf formatındaki) yazdırılabilir ve indirilebilir sürümlerini barındıran klasördür.
- **`preview/`**: Materyallerin web üzerinden anlık olarak "Ön İzleme" butonuna tıklandığında açılan, HTML tabanlı ve etkileşimli içerik dosyalarının bulunduğu klasördür. Her materyal için ayrı bir alt klasör barındırır.
- **`resim/`, `ses/`, `video/`**: Proje genelinde veya alt içeriklerde kullanılan görsel, işitsel ve video türündeki (assets) medya dosyalarını düzenli tutmak amacıyla oluşturulmuş klasörlerdir.

## Temel Özellikler
- **Dinamik Filtreleme:** Materyalleri Konu (Okuma, Dinleme, Yazma vb.), Tema (Birlikte Yaşam, Ben ve Ailem vb.), Seviye ve Yaş Grubuna göre saniyeler içinde filtreleme imkanı.
- **Çoklu İndirme Seçenekleri:** Materyalleri amaca göre PDF olarak veya e-öğrenme platformları (LMS) için SCORM paketi olarak indirme.
- **Anında Ön İzleme:** Materyalleri indirmeden önce tarayıcı üzerinde hızlıca test etme olanağı.
- **Modern ve Duyarlı Tasarım:** Her cihaza (mobil, tablet, masaüstü) uyum sağlayan, kullanıcı dostu ve estetik arayüz tasarımı.
