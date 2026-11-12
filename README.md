# Sağlıkçılar Evi Reels (Remotion)

Instagram Reels için sessiz video + altyazı üretir. Ses CapCut'ta ayrıca eklenir.

Projede iki video var:

| Video | Ayar dosyası | Komut |
| --- | --- | --- |
| Sağlıkçılar Evi | `reel.json` | `npm run render` |
| İzin günü ("Bu ay kaçıncı?") | `izin-gunu.json` | `npm run render:izin` |

Fontlar (Inter, Caveat) `public/fonts` içinde durur, render sırasında internete çıkılmaz.

## Kurulum

```bash
npm install
```

## Üretim

```bash
npm run render
```

`out/` klasörüne şunlar yazılır:

| Dosya | İçerik |
| --- | --- |
| `saglikcilar-evi-altyazili.mp4` | Görüntü + altyazı, ses kanalı yok |
| `saglikcilar-evi-temiz.mp4` | Aynı görüntü, altyazısız, ses kanalı yok |
| `saglikcilar-evi.srt` | Bütün altyazılar, UTF-8 |
| `kapak.png` | 1080x1920 kapak |
| `kontrol/kare-*.png` | 1, 9, 17, 24 ve 30. saniyelerden kontrol kareleri |

İzin günü videosu için dosya adları `izin-gunu-` ile başlar, kapak `out/izin-gunu-kapak.png`, kontrol kareleri `out/kontrol/izin-gunu/` altına yazılır.

Betik iki videoda da ses kanalı olmadığını `npx remotion ffprobe` ile doğrular.

Önizleme ve düzenleme için: `npm run studio`

## İzin günü videosu (`izin-gunu.json`)

Sahne kodları `src/izin/` altında. JSON'dan değiştirilebilenler:

- `caller`: telefonda arayan adı
- `scenes.*`: her sahnenin başlangıç/bitiş saniyesi, ekrandaki yazılar, tarih ve saatler, mesaj metni, DM'deki sayı
- `subtitles`: altyazılar. `"onScreen": true` olanlar ekranda zaten büyük yazıyla göründüğü için videoya basılmaz, SRT'ye girer.
- `checkFrames`: kontrol karelerinin saniyeleri
- `cover.title`: kapak yazısı

### Ses (`npm run ses:izin`)

`npm run render:izin` sonrası çalıştır. Gerekenler: `pip install numpy scipy` ve `espeak-ng`.

- `out/ses/efektler.wav`: titreşim, anahtar, tuş sesleri, geçişler, ortam sesi, kapanış zemini
- `out/ses/gecici-dis-ses.wav` ve `out/ses/dis-ses/*.wav`: espeak ile kılavuz dış ses. Sadece zamanlama için, yayına uygun değil.
- `out/izin-gunu-efektli.mp4`: altyazılı video + efektler (dış sesi CapCut'ta ekle)
- `out/izin-gunu-taslak-sesli.mp4`: efektler + geçici dış ses, zamanlamayı görmek için

Efektlerin zamanlaması `izin-gunu.json` içindeki sahne saniyelerinden okunur. Arayanın cümlesi `"voice": "caller"` ile işaretli, telefon hattı gibi filtrelenir.

Son 0,7 saniye videonun başına bağlanır (koridor sahnesi), Reels döngüye girince kesinti hissedilmez.

## Yeni video için (Sağlıkçılar Evi düzeni)

Sadece `reel.json` dosyasını değiştir:

- `output.name`: çıktı dosyalarının adı
- `list.items`, `list.emptyItem`: defterdeki satırlar ve boş kalan satır
- `scenes`: her sahnenin türü, başlangıç/bitiş saniyesi ve yazıları
- `subtitles`: altyazılar (saniye cinsinden). SRT'ye hepsi girer; sahnede aynı anda büyük yazı olarak görünen altyazı videoda gizlenir.
- `subtitleStyle`: altyazı boyutu ve en fazla satır sayısı. Sığmayan uzun altyazılar videoda metni değiştirmeden ardışık parçalara bölünür.
- `cover.title`: kapak yazısı

Sahne türleri: `list`, `listQuestion`, `night`, `cards`, `finale`.

Instagram güvenli alanı `safeArea` içinde tanımlı (x 90-990, y 250-1480).

Remotion kendi Chrome'unu indirir. Başka bir tarayıcı kullanmak istersen: `REMOTION_BROWSER=/yol/chrome npm run render`
