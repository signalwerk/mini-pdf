# Architecture

mini-pdf converts a small declarative document tree into the raw bytes of a
PDF file. The pipeline has three layers:

```
Document AST  ──►  Convert  ──►  PDF object model  ──►  Writer  ──►  PDF bytes
(structure.ts)   (writer/)      (dataTypes/ +          (writer/)
                                 generators/)
```

## 1. The document AST (`src/structure.ts`)

This is the input you build by hand. It is a plain tree of typed nodes
discriminated by `AstTypesEnum`:

- `DOCUMENT` — the root; holds `fonts` and `children` (viewports/pages).
- `VIEWPORT` — one page, with a `mediaBox` and child content.
- `TEXT` — a line of text at `x/y`, with `size`, `font`, and optional OpenType
  `features`.
- `TEXTBOX` — a top-left text region with width, height and absolute line
  height; each renderer wraps and clips its content to that region.
- `IMAGE` — a JPEG placement; carries the raw bytes (`data`) plus the on-page
  rectangle. Pixel size, bit depth and color space are read from the JPEG.
- `LINE` — a stroked line using top-left `x1/y1/x2/y2` coordinates.
- `BOX` — an unfilled stroked rectangle using top-left `x/y/width/height`.
  Both geometry nodes accept optional `borderWidth` and normalized RGB
  `borderColour` values, defaulting to `1` and black.
- `FONT` — a font declaration referenced by `id`; optional `data: Uint8Array`
  contains a single TrueType/OpenType face to embed. Without `data`, the
  declaration uses built-in Helvetica.

`DOCUMENT` also takes an optional `info` object (title, author, dates, …) that
becomes the PDF `/Info` document information dictionary.

The AST deliberately knows nothing about PDF syntax — it is the friendly,
high-level description of a page.

## 2. The PDF object model (`src/dataTypes/`)

PDF files are built from a handful of primitive object types. Each lives in its
own folder under `dataTypes/` as a small factory plus a `*ToString` serializer:

- `name` — `/Name` tokens
- `string` — `(literal strings)` with escaping
- `date` — `(D:YYYYMMDD…)` date literals (with a `Date` → PDF-date formatter)
- `array` — `[ … ]`
- `dictonary` — `<< /Key value >>` (dictionaries + key/value pairs)
- `operator` — content-stream / structural operators (`BT`, `Td`, `xref`, …)
- `stream` — a length-prefixed `stream … endstream` block
- `reference` — indirect references (`n g R`)
- `plainContent` — raw passthrough text
- `pdf` — the in-memory PDF container that collects all indirect objects

These primitives are the vocabulary the rest of the system emits.

## 3. Generators (`src/generators/`)

Generators assemble the primitives into the well-known PDF structural objects:

- `Catalog` — the document root object
- `Pages` / `Page` — the page tree
- `FontHelvetica` — a Type1 Helvetica font dictionary
- `TextLine` — the content-stream operators for one line of text
- `ShapedTextLine` — positions and paints the glyphs returned by OpenType
  shaping
- `Info` — the `/Info` document information dictionary (dates via the `date` primitive)
- `Header` — the `%PDF-…` header
- `PlainContent` — raw stream content

## 4. Convert (`src/writer/Convert.ts`)

`Convert` walks the AST and populates the in-memory PDF container
(`dataTypes/pdf`) with indirect objects, assigning object numbers as it goes.
It uses a reserve-then-fill pattern (`addObj` returns a reference immediately,
`replaceObj` fills it in later) so parents and children can reference each other.
It maps:

- `DOCUMENT` → Catalog + Pages + Font objects, and an `/Info` dictionary when
  `info` is set (its reference is stored on the PDF container and emitted in the
  trailer by `Writer`)
- `VIEWPORT` → a Page + its Resources dict + a content Stream
- `TEXT` → text-drawing operators appended to the page content
- `TEXTBOX` → internally wrapped text-drawing operators clipped by line count;
  embedded fonts are measured from fontkit's shaped glyph advances
- `LINE` / `BOX` → path operators appended to the page content
- `IMAGE` → a DCTDecode XObject (built in [`src/image.ts`](../src/image.ts) from
  the JPEG bytes) plus the operators that paint it; each image gets a unique
  resource name (`Im<n>`) so multiple images on a page don't collide

### Embedded font path (`src/font.ts`)

`fontkit` is a runtime dependency used for byte-backed `FONT` nodes. `Convert`
reserves each top-level font object, shapes every referencing `TEXT` node, and
collects the resulting glyphs. After all pages have been converted, it encodes
the subset and fills the reserved object plus its supporting PDF objects:

```
Type0 font (Identity-H)
├── descendant CIDFont + widths
├── FontDescriptor → subset FontFile2 or FontFile3 stream
└── ToUnicode CMap
```

The explicitly enabled default feature set is `kern`, `rlig`, `liga`, `clig`,
`calt`, `locl`, `ccmp`, `mark`, and `mkmk`. A feature object is merged after
those defaults, so its booleans win tag by tag and it can add other tags. A
feature array is additive: its tags are deduplicated with all defaults and
cannot disable them. Neither normalization path mutates the AST input.

Glyphs are painted at positions derived from fontkit's x/y advances and
offsets, which preserves kerning, substitutions such as ligatures, and mark
positioning returned by the shaper. `/ToUnicode` maps subset CIDs back to
UTF-16BE text, including supplementary-plane characters supported by the font
and multi-code-point ligature mappings.

The subset path supports TrueType outlines (`CIDFontType2` / `FontFile2`) and
CFF1 outlines (`CIDFontType0` / `FontFile3`). It rejects CFF2, font collections,
and fonts whose OS/2 flags forbid outline embedding or subsetting. Licensing
must still be checked by the caller. A `TEXT` node is one shaping run: there is
no mixed-direction bidi/script itemization, fallback, or line breaking here.

## 5. Writer (`src/writer/index.ts`)

`Writer` is the public entry. It runs `Convert`, then serializes every object in
order, tracking UTF-8 byte offsets to build the **xref table**, and finally appends
the **trailer** and `startxref` / `%%EOF`. The result is returned as a string.

`printDebug` produces a side-by-side dump (byte offset + line) which is handy
for inspecting the generated file — the demo writes this to `output/demo.txt`.

## Trying it

`npm run demo` builds the document in
[`examples/demo.ts`](../examples/demo.ts). It keeps every node type on the JPEG
page, then uses embedded Work Sans Medium and ExtraBold for Unicode, ligature
on/off, and kerning on/off examples. It writes `examples/output/demo.pdf` plus
the byte-offset debug dump `examples/output/demo.debug.txt`.
