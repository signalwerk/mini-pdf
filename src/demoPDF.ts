import * as fs from "fs";
import { Writer, printDebug } from "./writer/pdf";
import { DOC } from "./examples/Ast/PdfDoc";

const Demo = () => {
  const final = Writer(DOC);

  fs.writeFileSync("file.txt", printDebug(final));
  fs.writeFileSync("file.pdf", final);
  return `Hello World.`;
};

export default Demo;
