## Known issues / TODO

1. **Embedded-font scope is deliberately narrow.** The subset writer supports a
   single font face with TrueType or CFF1 outlines. CFF2 outlines and font
   collections (`.ttc`/`.otc`) are rejected. Each `TEXT` node is shaped as one
   run; mixed-direction bidi/script itemization, fallback, line breaking, and
   line layout are not implemented.
2. **Font licenses remain the caller's responsibility.** The writer rejects
   OS/2 flags that explicitly forbid outline embedding or subsetting, but this
   does not establish that a font's license permits distribution in a PDF.
3. **`ToUnicode` uses one mapping per subset glyph.** If one glyph is produced
   from different logical character sequences, the first mapping wins. Exact
   extraction for every such context would require distinct CIDs or marked
   content with `/ActualText`.
4. **Strict mode is off.** `tsconfig.json` uses `strict: false` to match the
   original (Jest/ts-jest default) behavior. Some spots (e.g. the optional
   `parentObj` in `Convert.ts`) would need null-checks before enabling `strict`.
5. **Type declarations build separately.** `npm run build` emits the bundle via
   Vite and `.d.ts` files via `tsc --emitDeclarationOnly`. If you prefer a
   single step, add `vite-plugin-dts`.

## Recently fixed

- ASCII85 image and embedded-font streams now end with the required single
  `~>` marker, and their declared stream lengths include it.
- Stream lengths, xref entries, `startxref`, and `printDebug` annotations now
  use UTF-8 byte counts rather than JavaScript character counts.
- Embedded fonts now support Unicode Type0/CIDFont output, kerning, ligatures,
  and the default `kern`, `rlig`, `liga`, `clig`, `calt`, `locl`, `ccmp`,
  `mark`, and `mkmk` feature set. Feature objects override individual defaults;
  arrays add tags without disabling defaults.
