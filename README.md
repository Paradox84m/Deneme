# Sağlıkçılar Evi Reels (Remotion)

Instagram Reels için sessiz video + altyazı üretir. Ses CapCut'ta ayrıca eklenir.

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

Betik iki videoda da ses kanalı olmadığını `npx remotion ffprobe` ile doğrular.

Önizleme ve düzenleme için: `npm run studio`

## Yeni video için

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
