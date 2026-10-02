#!/bin/sh
# Builds one Instagram story video per highlight:
#   output/<n>-<highlight>.mp4      1080x1920, 30–52 s: the whole highlight as one continuous
#                                   animation with its own music, sound effects, watermark and logo ending
#   output/covers/<highlight>.png   highlight covers
# Needs: node, python3, ffmpeg (set FFMPEG=/path/to/ffmpeg if it is not on PATH).
set -e
cd "$(dirname "$0")"
export FFMPEG=${FFMPEG:-ffmpeg}
rm -rf output cues audio
node render.js cues      # scene timings and sound cues from the animation
python3 audio.py         # music + effects scored to those cues
node render.js           # frames → MP4 with the audio
rm -rf cues audio
echo "Done: output/"
