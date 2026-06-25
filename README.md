# mini-pdf

A tiny PDF writer in TypeScript. It turns a small, declarative document tree
(an AST of pages, text and images) into the raw bytes of a valid PDF file.

> ⚠️ **Experimental / educational.** This is a learning project for
> understanding the PDF file format from the ground up. It is not feature
> complete and not recommended for production use.

## Usage

You build a document tree (the AST), then `Writer(doc)` returns the PDF file as
a string. The example below uses every node type: a font, a page (`VIEWPORT`),
text and an embedded JPEG image. Image metadata is read from the bytes you
pass — you only specify where it goes on the page.

```ts
import * as fs from "node:fs";
import { Writer, printDebug, AstTypesEnum } from "mini-pdf";

const doc = {
  type: AstTypesEnum.DOCUMENT,
  fonts: [{ type: AstTypesEnum.FONT, id: "F1" }],
  children: [
    {
      type: AstTypesEnum.VIEWPORT,
      attributes: { mediaBox: [0, 0, 300, 200] },
      children: [
        {
          type: AstTypesEnum.IMAGE,
          attributes: {
            x: 20,
            y: 40,
            width: 120,
            height: 120,
            data: fs.readFileSync("photo.jpg"), // raw JPEG bytes (Uint8Array)
          },
        },
        {
          type: AstTypesEnum.TEXT,
          attributes: {
            x: 20,
            y: 24,
            size: 24,
            font: "F1",
            content: "hello world",
          },
        },
      ],
    },
  ],
};

const pdf = Writer(doc); // a string containing the PDF bytes
fs.writeFileSync("hello.pdf", pdf);

// `printDebug` annotates each line with its byte offset — handy for inspecting
// the xref table and learning the file format.
fs.writeFileSync("hello.debug.txt", printDebug(pdf));
```

A runnable version lives in [examples/demo.ts](examples/demo.ts) — run it with
`npm run demo`.

### Inspecting a JPEG

The metadata helpers are exported too, so you can read a JPEG's size and color
mode (e.g. to scale it on the page) before embedding it:

```ts
import { jpegInfo, jpegSize, jpegColorMode } from "mini-pdf";

const info = jpegInfo(bytes); // { width, height, depth, components, colorMode }
jpegSize(bytes); //            → { width, height }
jpegColorMode(bytes); //       → "Gray" | "RGB" | "CMYK"
```

`jpegInfo` parses once and returns everything; `jpegSize` / `jpegColorMode` are
focused shortcuts for when you only need one fact.

### Document metadata

Add an optional `info` block to the document to populate the PDF `/Info`
dictionary (referenced from the trailer). Every field is optional; date fields
accept a `Date` (formatted automatically) or a ready-made PDF date string.

```ts
const doc = {
  type: AstTypesEnum.DOCUMENT,
  info: {
    title: "My Report",
    author: "Jane Doe",
    creator: "mini-pdf",
    creationDate: new Date(),
  },
  fonts: [
    /* … */
  ],
  children: [
    /* … */
  ],
};
```

## Scripts

| Command                 | Description                                              |
| ----------------------- | -------------------------------------------------------- |
| `npm run demo`          | Render the demo AST to `examples/output/` (PDF + debug). |
| `npm run demo:watch`    | Re-render the demo on every change.                      |
| `npm test`              | Run the test suite once (Vitest).                        |
| `npm run test:watch`    | Run tests in watch mode.                                 |
| `npm run test:coverage` | Run tests with coverage.                                 |
| `npm run build`         | Build the library (ESM + CJS) and types into `dist/`.    |
| `npm run lint`          | Lint with ESLint.                                        |

## Project structure

```
src/
  index.ts          Public entry point (Writer, printDebug, jpeg* + AST types)
  structure.ts      The document AST (the input you build)
  image.ts          JPEG inspection helpers + embedding
  writer/           AST → PDF object model → serialized bytes + xref/trailer
  generators/       Builders for PDF objects (Catalog, Pages, Page, Font, …)
  dataTypes/        Low-level PDF primitives (name, string, array, dictionary…)
  types/            Ambient type declarations for untyped deps
  util/             Small helpers
examples/
  demo.ts           One runnable example using every node type (npm run demo)
  assets/           Sample JPEG used by the demo
docs/               Architecture notes, findings and references
attic/              Old fragments kept for reference (not part of the build)
```

## Documentation

- [AGENTS.md](AGENTS.md) — orientation for AI agents and contributors.
- [docs/architecture.md](docs/architecture.md) — how a document becomes a PDF.
- [docs/findings.md](docs/findings.md) — repo cleanup notes and known issues.
- [docs/references.md](docs/references.md) — external links and resources.

## License

[MIT](LICENSE) © Stefan Huber
