<<<<<<< HEAD
# 🤖 Talking Avatar App

React Native + Expo kullanarak D-ID API ile konuşan avatar uygulaması.

## 🚀 Özellikler

- ✅ D-ID API entegrasyonu
- ✅ Gerçek zamanlı video oluşturma
- ✅ Modern ve kullanıcı dostu arayüz
- ✅ Yüklenme durumu göstergesi
- ✅ Hata yönetimi
- ✅ Video oynatma kontrolü

## 📋 Gereksinimler

- Node.js (v14 veya üzeri)
- npm veya yarn
- Expo CLI
- D-ID API Key ([buradan alın](https://studio.d-id.com/))

## 🔧 Kurulum

1. **Projeyi klonlayın veya indirin**

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **API Key'inizi ekleyin:**

`.env` dosyasını açın ve D-ID API key'inizi ekleyin:

```env
D_ID_API_KEY=Basic [your_api_key_here]
```

**Önemli:** API key'inizi D-ID Studio'dan alabilirsiniz. Format: `Basic [api_key]`

4. **Uygulamayı başlatın:**
```bash
npx expo start
```

## 📱 Kullanım

1. Uygulamayı açın
2. Metin kutusuna avatarın söylemesini istediğiniz metni yazın
3. "🎤 Konuş" butonuna basın
4. Avatar hazırlanırken bekleyin (genellikle 10-30 saniye)
5. Video otomatik olarak oynatılacaktır
6. Yeni bir konuşma için "🔄 Yeni Konuşma" butonuna basın

## 🛠️ Teknolojiler

- **React Native** - Mobil uygulama framework'ü
- **Expo** - React Native geliştirme platformu
- **expo-av** - Video oynatma
- **axios** - HTTP istekleri
- **D-ID API** - AI avatar ve konuşma sentezi

## 📂 Proje Yapısı

```
AvatarApp3/
├── App.js              # Ana uygulama dosyası
├── .env                # API key konfigürasyonu
├── .env.example        # Örnek env dosyası
├── babel.config.js     # Babel konfigürasyonu
├── env.d.ts            # TypeScript tanımlamaları
├── package.json        # Proje bağımlılıkları
└── assets/             # Uygulama görselleri
```

## 🔑 D-ID API

Bu uygulama D-ID API'nin `/talks` endpoint'ini kullanır:

- **POST** `/talks` - Yeni konuşma oluştur
- **GET** `/talks/{id}` - Konuşma durumunu kontrol et

API Dokümantasyonu: https://docs.d-id.com/

## 🐛 Sorun Giderme

### "API Key Eksik" hatası alıyorum
- `.env` dosyasında `D_ID_API_KEY` değerinin doğru formatta olduğundan emin olun
- Format: `Basic [your_api_key]`
- Uygulamayı yeniden başlatın

### Video yüklenmiyor
- İnternet bağlantınızı kontrol edin
- API key'inizin geçerli olduğundan emin olun
- D-ID hesabınızda kredi olup olmadığını kontrol edin

### Metro bundler hatası
```bash
npx expo start --clear
```

## 📝 Notlar

- Her video oluşturma işlemi D-ID hesabınızdan kredi tüketir
- Video oluşturma süresi metin uzunluğuna göre değişir (10-30 saniye)
- İnternet bağlantısı gereklidir

## 🎨 Özelleştirme

### Avatar görselini değiştirmek için:
`App.js` dosyasında `AVATAR_IMAGE_URL` değişkenini düzenleyin:

```javascript
const AVATAR_IMAGE_URL = 'your_image_url_here';
```

### Renkleri değiştirmek için:
`styles` objesindeki renk kodlarını düzenleyin.

## 📄 Lisans

Bu proje eğitim amaçlıdır.

## 🤝 Katkıda Bulunma

Pull request'ler kabul edilir. Büyük değişiklikler için lütfen önce bir issue açın.

---

**Geliştirici:** AI Avatar Team
**Versiyon:** 1.0.0

=======
# Suolingo
>>>>>>> 85429604029c69e627956fbb38e351c5f9b05e65
