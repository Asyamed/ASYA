# JavaScript Modül Yapısı

Bu dizin, uygulama JavaScript kodlarının modüler bir şekilde organize edilmesi için güncellendi. Yapının amacı, sayfa giriş noktalarını ortak bileşen ve yardımcı kodlardan ayırarak yeniden kullanılabilirliği ve bakım kolaylığını artırmaktır.

## Dizinler

- `pages/`: Her bir HTML sayfası için giriş noktası modülleri. Sayfa özelindeki başlangıç işlemleri burada tanımlanır ve gerekirse yardımcı modüller içeri aktarılır.
- `widgets/`: Pano içi bileşenler ve tekrar kullanılabilir arayüz modülleri. Örneğin `dashboard.js` veya `study_assistant.js` bu klasörde yer alır.
- `utils/`: Sayfalar arasında paylaşılan küçük yardımcı fonksiyonlar. `modal.js` genel amaçlı modal açma-kapama mantığını, `dom.js` ise sayfa yüklenişi gibi basit DOM yardımcılarını içerir.
- `services/`: Uygulama genelinde kullanılan yapılandırmalar veya servis tanımları. `firebaseConfig.js` Firebase yapılandırmasını tek bir kaynaktan sağlamaya yarar.

## Bağımlılık İlişkileri

- `pages/homepage.js` Firebase yapılandırmasını `services/firebaseConfig.js` dosyasından alır ve `widgets/` altındaki bileşenleri içeri aktararak pano deneyimini oluşturur.
- `pages/login.js` aynı Firebase yapılandırmasını kullanarak kimlik doğrulama akışını yönetir.
- `pages/index.js` genel amaçlı modalları `utils/modal.js` üzerinden kontrol eder ve sayfa yüklenişinde `utils/dom.js` fonksiyonlarını kullanır.
- `widgets/` altındaki dosyalar doğrudan DOM çıktıları üretir; bu bileşenlerin dış bağımlılıkları yalnızca onları kullanan sayfa modülleridir.

Bu yapı sayesinde yeni bir sayfa eklerken yalnızca `pages/` klasörüne yeni bir dosya eklemek ve ihtiyaç duyulan yardımcıları `utils/`, `services/` veya `widgets/` altından içeri aktarmak yeterlidir.
