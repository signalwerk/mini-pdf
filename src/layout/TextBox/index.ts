import { TextBox } from "../../structure";

export type TextBoxLine = {
  content: string;
  x: number;
  y: number;
};

export type MeasureText = (text: string) => number;

const characterWidth = (character: string): number => {
  if (/\s/.test(character)) return 0.33;
  if (/[ilI.,:;!'|]/.test(character)) return 0.35;
  if (/[mwMW@%]/.test(character)) return 1;
  if (/[A-Z]/.test(character)) return 0.69;
  if (/[0-9]/.test(character)) return 0.65;
  return 0.56;
};

export const estimateTextWidth = (text: string, size: number): number =>
  Array.from(text).reduce(
    (width, character) => width + characterWidth(character) * size,
    0,
  );

const wrapParagraph = (
  paragraph: string,
  width: number,
  measureText: MeasureText,
): Array<string> => {
  const words = paragraph.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];

  const lines: Array<string> = [];
  let line = words[0];
  words.slice(1).forEach((word) => {
    const candidate = `${line} ${word}`;
    if (measureText(candidate) <= width) {
      line = candidate;
    } else {
      lines.push(line);
      line = word;
    }
  });
  lines.push(line);
  return lines;
};

export const layoutTextBox = (
  attributes: TextBox["attributes"],
  measureText?: MeasureText,
): Array<TextBoxLine> => {
  const {
    x,
    y,
    width,
    height,
    lineHeight,
    size,
    content,
    textAnchor = "start",
  } = attributes;

  if (width < 0 || height < 0) {
    throw new Error("TextBox width and height must be zero or greater.");
  }
  if (lineHeight <= 0) {
    throw new Error("TextBox lineHeight must be greater than zero.");
  }
  if (size < 0) {
    throw new Error("TextBox size must be zero or greater.");
  }
  if (!["start", "middle", "end"].includes(textAnchor)) {
    throw new Error(`Unsupported text anchor: "${textAnchor}".`);
  }

  const measure =
    measureText ?? ((text: string) => estimateTextWidth(text, size));

  const wrapped = content
    .split(/\r?\n/)
    .flatMap((paragraph) => wrapParagraph(paragraph, width, measure));

  return wrapped
    .map((line, index) => {
      const lineWidth = measure(line);
      const lineX =
        textAnchor === "end"
          ? x + width - lineWidth
          : textAnchor === "middle"
            ? x + (width - lineWidth) / 2
            : x;

      return {
        content: line,
        x: lineX,
        y: y + size * 0.82 + index * lineHeight,
      };
    })
    .filter((line) => line.y <= y + height);
};
