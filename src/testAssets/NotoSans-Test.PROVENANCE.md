# Noto Sans test subset

`NotoSans-Test.ttf.base64` is a base64-encoded, test-only subset of Noto Sans
Regular. Tests remove ASCII whitespace and decode it with `Buffer.from(...,
"base64")` before passing the resulting bytes to mini-pdf.

- Upstream file: `hinted/ttf/NotoSans/NotoSans-Regular.ttf`
- Upstream URL: https://raw.githubusercontent.com/notofonts/noto-fonts/main/hinted/ttf/NotoSans/NotoSans-Regular.ttf
- Upstream version: 2.008
- Upstream SHA-256: `b85c38ecea8a7cfb39c24e395a4007474fa5a4fc864f6ee33309eb4948d232d5`
- Decoded subset SHA-256: `5c9f80c9a94dec4f11c352cd10aadb9a4944202315062ef69a9f56ce91c6772d`
- Decoded subset size: 9,652 bytes
- Subsetter: FontTools 4.63.0

The subset was produced with:

```sh
pyftsubset NotoSans-Regular.ttf \
  --output-file=NotoSans-Test.ttf \
  --text='AVfi café Ω Ж' \
  --layout-features=kern,liga,ccmp,mark,mkmk \
  --glyph-names \
  --notdef-glyph \
  --notdef-outline \
  --recommended-glyphs \
  --name-IDs='*' \
  --name-legacy \
  --name-languages='*'
```

The subset contains only glyphs and OpenType data needed to verify Unicode,
`AV` kerning, and the standard `fi` ligature. It is a Modified Version under
the SIL Open Font License 1.1. The upstream copyright notice and full license
are preserved in `OFL.txt`.
