# AGENTS.md

Orientation for AI agents (and humans) working in this repo. Keep it current
when the setup changes.

## What this is

**mini-pdf** — a tiny, educational PDF writer in TypeScript. You build a small
declarative document tree (an AST), and `Writer(doc)` returns the bytes of a
valid PDF as a string. Experimental; not production-grade.

## How it works (the pipeline)

```
Document AST  ──►  Convert  ──►  PDF object model  ──►  Writer  ──►  PDF bytes
(structure.ts)   (writer/)      (dataTypes/ +          (writer/)
                                 generators/)
```

1. `src/structure.ts` — the AST you build. Node types via `AstTypesEnum`:
   `DOCUMENT` → (`info?`, `fonts`, `children`); `VIEWPORT` (a page);
   `TEXT`; `IMAGE` (carries raw JPEG bytes); `FONT` (optionally carries raw
   TrueType/OpenType bytes).
2. `src/dataTypes/*` — PDF primitives (name, string, array, dictionary, stream,
   reference, operator, plainContent) as `factory` + `*ToString` serializer.
3. `src/generators/*` — assemble primitives into PDF objects (Catalog, Pages,
   Page, FontHelvetica, TextLine, ShapedTextLine, Header, PlainContent, Info).
4. `src/writer/Convert.ts` — walks the AST, fills the in-memory PDF container
   (`dataTypes/pdf`) with indirect objects (reserve-then-fill via
   `addObj`/`replaceObj`). `src/font.ts` uses `fontkit` to shape and subset
   byte-backed fonts, then builds their Type0/CIDFont and `/ToUnicode` objects.
5. `src/writer/index.ts` — `Writer` serializes objects, builds the xref table by
   tracking byte offsets, then writes the trailer + `startxref`/`%%EOF`.
   `printDebug` re-emits the bytes annotated with each line's byte offset.

Public entry is `src/index.ts`: `Writer`, `printDebug`, the JPEG helpers
(`jpegInfo`, `jpegSize`, `jpegColorMode`) and all AST types.

## Commands

| Command              | What it does                                                       |
| -------------------- | ------------------------------------------------------------------ |
| `npm run demo`       | Render the JPEG + Work Sans shaping demo → `examples/output/`.     |
| `npm run demo:watch` | Same, re-running on change.                                        |
| `npm test`           | Vitest, run once. `test:watch` / `test:coverage` exist.            |
| `npm run build`      | Vite library build (ESM + CJS) + `tsc` `.d.ts` into `dist/`.       |
| `npm run lint`       | ESLint.                                                            |

Tooling: **Vite** (lib build) + **Vitest** (tests, globals on, so `.spec.ts`
files use `test`/`expect` without imports). Tests live next to source as
`src/**/*.spec.ts`. Package is ESM (`"type": "module"`).

## Conventions & gotchas

- **`strict: false`** in `tsconfig.json` (matches the original setup). Don't rely
  on null-checking; some code passes `null`/optionals loosely.
- **Folder name `src/dataTypes/dictonary` is misspelled** ("dictonary"). It's
  load-bearing across imports — match it, don't "fix" it casually.
- **Object numbering:** the catalog is always object 1, so `Writer` hardcodes
  `/Root 1 0 R`. If you add indirect objects in `Convert`, keep the catalog
  first. The `/Info` ref is stored on the PDF container (`pdf.info`) and read by
  the trailer.
- **Images:** the AST `IMAGE` node carries raw JPEG bytes in `attributes.data`;
  `src/image.ts` reads metadata from the header (no filesystem access) and embeds
  an ASCII85 + DCTDecode XObject. Each image gets a unique `Im<n>` resource name.
- **Embedded fonts:** `FONT.data` is a `Uint8Array`. `fontkit` shapes each
  `TEXT` node as one run and subsets used glyphs. `kern`, `rlig`, `liga`,
  `clig`, `calt`, `locl`, `ccmp`, `mark`, and `mkmk` default to on. A
  `TEXT.attributes.features` object overrides individual defaults and may add
  tags; an array only adds deduplicated tags while preserving every default.
  TrueType and CFF1 outlines are supported; CFF2 and font collections are
  rejected. The PDF uses Identity-H CIDs and `/ToUnicode` for Unicode
  extraction.
- **Text-layout boundary:** there is no mixed-direction bidi/script itemization,
  font fallback, or line layout. Font licensing remains the caller's
  responsibility; OS/2 no-embedding/no-subsetting flags are enforced.
- **Byte accounting:** streams, xref, `startxref`, and `printDebug` use UTF-8
  byte lengths. ASCII85 streams include one trailing `~>` EOD marker.
- **`attic/`** holds parked fragments and large local-only binaries; it is not
  part of the build. Don't import from it.
- Runtime deps `ascii85` and `fontkit` have ambient declarations in
  `src/types/` and are externalized by the Vite library build.

## Docs

- `docs/architecture.md` — the pipeline in detail.
- `docs/findings.md` — cleanup history and the open issues/TODO list.
- `docs/references.md` — external resources.
