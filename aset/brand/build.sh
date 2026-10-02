#!/bin/sh
# Builds the Linea.js video branding into dist/:
#   outro-16x9.mp4, outro-9x16.mp4   closing animation with sound (3.6 s, 30 fps)
#   watermark-16x9.png, watermark-9x16.png   corner watermark (transparent)
# Every video folder in this repository uses them through ../brand/apply-brand.sh.
set -e
cd "$(dirname "$0")"
FFMPEG=${FFMPEG:-ffmpeg}
python3 audio.py
node render.js
for fmt in h v; do
  name=$([ "$fmt" = v ] && echo 9x16 || echo 16x9)
  "$FFMPEG" -y -loglevel error -framerate 30 -i "frames/$fmt/%05d.jpg" -i outro.wav \
    -c:v libx264 -pix_fmt yuv420p -crf 18 -preset slow -c:a aac -b:a 192k -ar 44100 -ac 2 \
    -shortest -movflags +faststart "dist/outro-$name.mp4"
done
rm -rf frames outro.wav
echo "Done: dist/"
