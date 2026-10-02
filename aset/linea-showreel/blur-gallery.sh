#!/bin/sh
# Copies the project screenshots from the linea.js site (cloned next to this repo) into
# gallery/*.jpg with client names and logos blurred, so no real brand shows in the video.
# Each region is x:y:w:h in the original image's pixels.
set -e
cd "$(dirname "$0")"
FFMPEG=${FFMPEG:-ffmpeg}
SRC=${SRC:-../../../linea.js/public/projects/gallery}
mkdir -p gallery

blur() { # blur <name> <region> [<region> ...]
  name=$1; shift
  chain="[0:v]null[v0]"; i=0
  for r in "$@"; do
    x=${r%%:*}; r2=${r#*:}; y=${r2%%:*}; r3=${r2#*:}; w=${r3%%:*}; h=${r3#*:}
    chain="$chain;[0:v]crop=$w:$h:$x:$y,boxblur=luma_radius=10:luma_power=3:chroma_radius=5:chroma_power=3[b$i];[v$i][b$i]overlay=$x:$y[v$((i+1))]"
    i=$((i+1))
  done
  "$FFMPEG" -nostdin -loglevel error -y -i "$SRC/$name.webp" -filter_complex "$chain" -map "[v$i]" -q:v 2 "gallery/$name.jpg"
}

blur king-paddle-1      220:0:220:70      230:222:780:36
blur apotek-3           0:0:280:62
blur fleet-operations-1 40:40:280:52      180:850:200:40
blur pastry-1           8:8:240:56        424:266:226:26    430:356:460:24
blur motor-1
echo "gallery/ ready"
