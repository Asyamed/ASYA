# ASYA

ASYA, tıp profesyonelleri ve öğrencileri için tasarlanmış yapay zekâ destekli platformun web arayüzünü barındırır. Depo artık Flask/Django gibi Jinja uyumlu şablon yapısına göre düzenlenmiş statik varlıklarla birlikte gelir.

## Proje Yapısı

```
static/
  css/
  img/
  js/
    modules/
templates/
  base.html
  pages/
    homepage.html
    index.html
    login.html
  partials/
    *.html
```

- **templates/**: Uygulamanın sayfa şablonları. `base.html` ortak başlık, altbilgi ve global script referanslarını içerir; `partials/` altındaki parçalar tekrar kullanılabilir bileşenleri barındırır.
- **static/**: Harici stil, betik ve görseller. Sayfa bazlı JS dosyaları (`index.js`, `login.js`, `homepage.js`) ilgili şablonlar tarafından yüklenir.
- **static/js/modules/**: Giriş yaptıktan sonraki uygulama ekranında kullanılan modüler JavaScript bileşenleri.

## Geliştirme

1. Seçtiğiniz Python web çatısında (ör. Flask) `templates/` ve `static/` klasörlerini varsayılan dizinler olarak gösterin.
2. Sunucuyu başlattıktan sonra aşağıdaki rotaları eşleştirin:
   - `/` → `templates/pages/index.html`
   - `/login` → `templates/pages/login.html`
   - `/app` (veya tercihinize göre) → `templates/pages/homepage.html`
3. Firebase yapılandırması ve CDN üzerinden yüklenen kütüphaneler (Tailwind CSS, Three.js, Markdown-it) doğrudan tarayıcıya servis edilir; ek build adımı gerekmez.

## Notlar

- Arka plan parçacık animasyonu ve modal yönetimi `static/js/index.js` içinde tutulur.
- Giriş sonrası pano deneyimi `static/js/homepage.js` ve alt modüller ile yönetilir; modül içindeki görseller `/static/img/` altından servis edilir.
- Giriş/kayıt akışları Firebase Authentication ve Firestore üzerine kuruludur; gerekli anahtarlar `static/js/login.js` içinde yer alır.
