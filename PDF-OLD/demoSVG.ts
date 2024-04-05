import * as fs from "fs";
import { Writer } from "./writer/svg/";
import { DOC } from "./examples/ast/ChartDoc";

const Demo = () => {
  const final = Writer(DOC);

  fs.writeFileSync("file.svg", final);
  return `Hello World. SVG`;
};

export default Demo;
