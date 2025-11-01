# 🎯 Talking Avatar App - Hızlı Başlangıç Kılavuzu

## ✅ Kurulum Tamamlandı!

Tebrikler! Talking Avatar uygulamanız başarıyla oluşturuldu ve çalışıyor.

## 🔑 ÖNEMLİ: API Key Ekleme

Uygulamayı kullanmadan önce D-ID API key'inizi eklemeniz gerekiyor:

### 1. D-ID API Key Alma

1. https://studio.d-id.com/ adresine gidin
2. Hesap oluşturun veya giriş yapın
3. API key'inizi alın

### 2. API Key'i Projeye Ekleme

`.env` dosyasını açın ve şu satırı düzenleyin:

```env
D_ID_API_KEY=Basic [buraya_api_key_yapıştırın]
```

**Örnek:**
```env
D_ID_API_KEY=Basic dXNlcm5hbWU6cGFzc3dvcmQ=
```

### 3. Uygulamayı Yeniden Başlatma

API key'i ekledikten sonra:
- Terminal'de `Ctrl+C` ile Metro bundler'ı durdurun
- `npx expo start` komutu ile yeniden başlatın

## 📱 Uygulamayı Test Etme

### Mobil Cihazda Test (Önerilen)

1. **Android için:**
   - Google Play Store'dan "Expo Go" uygulamasını indirin
   - Terminal'deki QR kodu Expo Go ile tarayın

2. **iOS için:**
   - App Store'dan "Expo Go" uygulamasını indirin
   - Kamera uygulaması ile QR kodu tarayın

### Web'de Test

Terminal'de `w` tuşuna basın veya:
```bash
npx expo start --web
```

## 🎮 Uygulama Kullanımı

1. **Metin Girin:** "Avatarın söylemesini istediğin metni yaz..." kutusuna bir metin yazın
   - Örnek: "Merhaba! Ben yapay zeka destekli bir avatarım."

2. **Konuş Butonuna Basın:** 🎤 Konuş butonuna tıklayın

3. **Bekleyin:** Avatar hazırlanırken "Avatar hazırlanıyor..." mesajını göreceksiniz (10-30 saniye)

4. **İzleyin:** Video otomatik olarak oynatılacak

5. **Yeni Konuşma:** 🔄 Yeni Konuşma butonuna basarak yeni bir metin deneyin

## 🛠️ Yararlı Komutlar

```bash
# Uygulamayı başlat
npx expo start

# Cache'i temizle ve başlat
npx expo start --clear

# Android emulator'de aç
npx expo start --android

# iOS simulator'de aç (sadece Mac)
npx expo start --ios

# Web tarayıcıda aç
npx expo start --web
```

## 🐛 Sık Karşılaşılan Sorunlar

### "API Key Eksik" Hatası
- `.env` dosyasında API key'in doğru formatta olduğundan emin olun
- Format: `Basic [api_key]` (Basic kelimesi ve boşluk önemli!)
- Metro bundler'ı yeniden başlatın

### "Bir hata oluştu" Mesajı
- İnternet bağlantınızı kontrol edin
- D-ID hesabınızda kredi olup olmadığını kontrol edin
- API key'inizin geçerli olduğundan emin olun

### Metro Bundler Hatası
```bash
npx expo start --clear
```

### Port Zaten Kullanımda
```bash
# Farklı bir port kullan
npx expo start --port 8082
```

## 📊 Proje Yapısı

```
AvatarApp3/
├── App.js              ← Ana uygulama kodu (tüm mantık burada)
├── .env                ← API key buraya eklenir
├── .env.example        ← Örnek env dosyası
├── babel.config.js     ← Babel konfigürasyonu
├── package.json        ← Proje bağımlılıkları
└── README.md           ← Detaylı dokümantasyon
```

## 🎨 Özelleştirme İpuçları

### Avatar Görselini Değiştirme
`App.js` dosyasında 20. satırı düzenleyin:
```javascript
const AVATAR_IMAGE_URL = 'yeni_gorsel_url';
```

### Renkleri Değiştirme
`App.js` dosyasının en altındaki `styles` objesinde renk kodlarını düzenleyin.

### Buton Metinlerini Değiştirme
`App.js` dosyasında buton metinlerini arayın ve değiştirin.

## 💡 İpuçları

1. **Kısa Metinler:** İlk testlerinizde kısa metinler kullanın (5-10 kelime)
2. **Türkçe Destek:** D-ID API Türkçe metinleri destekler
3. **Kredi Takibi:** Her video oluşturma D-ID hesabınızdan kredi tüketir
4. **İnternet:** Uygulama internet bağlantısı gerektirir

## 📞 Destek

Sorun yaşarsanız:
1. README.md dosyasını okuyun
2. Terminal'deki hata mesajlarını kontrol edin
3. `.env` dosyasının doğru yapılandırıldığından emin olun

## 🎉 Başarılar!

Artık kendi Talking Avatar uygulamanız hazır! Keyifli kodlamalar! 🚀

---

**Not:** Bu uygulama eğitim amaçlıdır. Üretim ortamında kullanmadan önce güvenlik ve performans iyileştirmeleri yapmanız önerilir.

