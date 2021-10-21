import * as fs from "fs";
import { Writer, printDebug } from "./writer/";
import { DOC } from "./examples/Ast/demo";

const Demo = () => {
  const final = Writer(DOC);

  fs.writeFileSync("file.txt", printDebug(final));
  fs.writeFileSync("file.pdf", final);
  return `Hello World.`;
};

export default Demo;
