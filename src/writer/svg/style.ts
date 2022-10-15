import { AstStyle } from "../../dataTypes/ast/Style";
import { svgColor } from "./color";
export const svgStyle = (rect: AstStyle): any => {
  const {
    stroke,
    // strokeDasharray,
    strokeWidth,
    // strokeLinecap,
    // strokeLinejoin,
    fill,
    vectorEffect,
  } = rect.attributes;

  let main: any = {
    // fill: "rgb(255,255,255)",
  };

  if (stroke) {
    main.stroke = svgColor(stroke);
  }
  // if (strokeDasharray) {
  //   main.strokeDasharray = strokeDasharray;
  // }
  if (strokeWidth) {
    main.strokeWidth = strokeWidth;
  }
  // if (strokeLinecap) {
  //   main.strokeLinecap = strokeLinecap;
  // }
  // if (strokeLinejoin) {
  //   main.strokeLinejoin = strokeLinejoin;
  // }
  if (fill) {
    main.fill = svgColor(fill);
  }
  if (vectorEffect) {
    main.vectorEffect = vectorEffect;
  }

  return main;
};
