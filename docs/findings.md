## Known issues / TODO

1. **ASCII85 stream has no `~>` EOD marker.** The bytes are ASCII85-encoded as in
   the original code, without the trailing `~>` that strict PDF readers expect
   for `ASCII85Decode`. Rendering hasn't been validated in a viewer yet.
2. **Strict mode is off.** `tsconfig.json` uses `strict: false` to match the
   original (Jest/ts-jest default) behavior. Some spots (e.g. the optional
   `parentObj` in `Convert.ts`) would need null-checks before enabling `strict`.
3. **Type declarations build separately.** `npm run build` emits the bundle via
   Vite and `.d.ts` files via `tsc --emitDeclarationOnly`. If you prefer a
   single step, add `vite-plugin-dts`.
