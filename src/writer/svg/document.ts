import { AstDocument } from "../../dataTypes/ast/Document";
import { svg } from "../svg";

export const svgDocument = (document: AstDocument): any => {
  const firstPage = document.children[0];

  if (!firstPage) {
    return;
  }

  const { x, y, width, height } = firstPage.attributes.mediaBox.attributes;

  const main = {
    tag: "svg",
    attributes: {
      className: document.attributes.className,
      viewBox: `${x} ${y} ${width} ${height}`,
      xmlns: "http://www.w3.org/2000/svg",
    },
    children: svg(firstPage.children),
  };
  return main;
};
