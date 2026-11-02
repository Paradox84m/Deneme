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

---

# Bir kapı daha… (Kastamonu Şubesi açılışı)

Aynı projede ikinci video. Ayarları `kapi.json`, kodu `src/kapi/` altında. Prodüksiyon planı: `docs/bir-kapi-daha-produksiyon-plani.md`.

```bash
npm run render:kapi
```

| Dosya | İçerik |
| --- | --- |
| `out/bir-kapi-daha.mp4` | 30 sn, 1080x1920, 24 fps, yazılı, ses kanalı yok |
| `out/bir-kapi-daha-yazisiz.mp4` | Aynı görüntü, hikâye ve davet yazıları yok (logo var) |
| `out/bir-kapi-daha-kapak.png` | Reels kapağı |
| `out/kontrol/bir-kapi-daha-*.png` | Kontrol kareleri |

Ses yok: müzik ve ses efektleri CapCut'ta, plandaki zaman tablosuna göre eklenir.

## Gerçek çekim ya da AI klibi koymak

Görüntüler şimdilik çizim (animasyon). Bir sahne için klip hazır olunca:

1. Klibi `public/kapi/klipler/` klasörüne koy (9:16, sahne süresi kadar).
2. `kapi.json` içinde `clips` altındaki ilgili sahneye dosya adını yaz, örneğin `"sahne4": "salon.mp4"`.
3. `npm run render:kapi` ile yeniden üret. Yazılar, gren ve davet ekranı klibin üstüne aynen gelir.

| Anahtar | Süre |
| --- | --- |
| `sahne1` | 0-5 sn, koridor |
| `sahne2` | 5-10 sn, kapı açılıyor ve çay masası |
| `sahne3` | 10-16 sn, kesmeler |
| `sahne4` | 16-22 sn, salon |

Son 8 saniye (logo ve davet) her zaman koddan üretilir. Yazıları değiştirmek için `kapi.json` içindeki `texts` ve `invite` alanlarını düzenle.

Logo: `public/kapi/logo.png`, verilen orijinal logodan yuvarlak kırpılarak üretildi. Elinizde daha yüksek çözünürlüklü (SVG ya da büyük PNG) sürüm varsa aynı adla değiştirin.
