# FPS Oyun Web Arayüzü

Bu proje, Unity ile geliştirilen FPS oyunu için hazırlanmış modern ve dinamik bir web arayüzüdür. Nuxt 3 + TypeScript + Firebase kullanılarak oluşturulmuştur.

---

## Genel Sayfalar (Kullanıcı)

| Sayfa                             | Açıklama                                                  |
|----------------------------------|------------------------------------------------------------|
| `/`                              | Anasayfa – Video, tanıtım, son haberler, harita özetleri |
| `/login`                         | Giriş yapma ekranı                                       |
| `/register`                      | Kayıt olma ekranı                                        |
| `/profile`                       | Profil sayfası (avatar, istatistik, bilgiler)            |
| `/inventory`                     | Kullanıcının sahip olduğu ürünlerin listesi              |
| `/deposit`                       | Bakiye yükleme ekranı                                    |
| `/cart`                          | Sepet – Ürün satın alma işlemleri                        |
| `/shop`                          | Mağaza – Ürünlerin listelendiği yer                      |
| `/news`                          | Haberler listesi                                         |
| `/news/[id]`                     | Tekil haber detay sayfası                                |
| `/maps`                          | Haritaların listelendiği tanıtım sayfası                 |

---

## Giriş Gerektiren Sayfalar

Bu sayfalar sadece **giriş yapmış kullanıcılar** tarafından görüntülenebilir:

- `/profile`
- `/inventory`
- `/deposit`
- `/cart`
- `/shop`

---

## Admin Panel Sayfaları

Tüm admin sayfalarına erişmek için kullanıcının `role: admin` yetkisine sahip olması gerekir.

| Sayfa                                 | Açıklama                                      |
|--------------------------------------|-----------------------------------------------|
| `/admin/dashboard`                   | Admin panel istatistik ekranı                 |
| `/admin/users`                       | Kullanıcı listesi                             |
| `/admin/products`                    | Ürün yönetimi (product koleksiyonu)           |
| `/admin/items`                       | Item yönetimi (item koleksiyonu)              |
| `/admin/avatars`                     | Avatar yönetimi (kullanılabilir avatarlar)    |
| `/admin/wallets`                     | Kullanıcı bakiyeleri                          |
| `/admin/news`                        | Haberleri listele, düzenle, sil               |
| `/admin/news/new`                    | Yeni haber ekleme sayfası                     |
| `/admin/maps`                        | Harita yönetimi (listele/düzenle/sil)         |
| `/admin/maps/new`                    | Yeni harita ekleme ekranı                     |
| `/admin/homepage`                    | Ana sayfa içerik düzenleme (hero vs.)         |
| `/admin/settings/footer`            | Footer linkleri ve sponsorları yönetme        |
| `/admin/settings/navbar`            | Navbar linkleri düzenleme ve sıralama ekranı  |

---

## Firestore Yapısı (Özet)

| Koleksiyon        | Açıklama                                       |
|-------------------|------------------------------------------------|
| `users`           | Kullanıcı bilgileri (uid, email, role, avatar) |
| `wallets/{uid}`   | Kullanıcı bakiyesi                             |
| `inventory/{uid}` | Kullanıcıya ait ürünler                        |
| `products`        | Satın alınabilir ürünler                       |
| `items`           | Ürünlerin detayları                            |
| `news`            | Haber verileri                                 |
| `maps`            | Harita verileri                                |
| `avatars`         | Avatar seçenekleri                             |
| `homepage`        | Anasayfa içerikleri (`main` belgesi)           |
| `navbar`          | Navbar menü öğeleri (rastgele ID ile)          |

---

## Geliştiriciler İçin Notlar

- Admin layout: `layouts/admin.vue`
- Tüm admin sayfaları `admin` middleware ile korunmalı.
- `authOnly` özelliği navbar'da SSR sırasında `undefined` gelebileceği için dikkatli kontrol edilmeli.
- Navbar sıralaması `order` alanına göre yapılır.
- Firestore’dan gelen tüm veriler reactive `ref` içine alınmalı.
