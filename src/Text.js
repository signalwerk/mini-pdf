import Stream from "./Stream";

class Text {
  constructor(text) {
    this._x = 0;
    this._y = 0;
    this._fontSize = 12;
    this._fontFamily = "F1";
    this._text = text || "";
    this._obj = null
    this._parent = null;
  }

  parent(parent) {
    this._parent = parent;
    return this;
  }

  x(x) {
    this._x = x;
    return this;
  }

  y(y) {
    this._y = y;
    return this;
  }
  fontSize(fontSize) {
    this._fontSize = fontSize;
    return this;
  }

  fontFamily(fontFamily) {
    this._fontFamily = fontFamily;
    return this;
  }
  onAddObj(currentObj) {
    this._obj = currentObj;
  }
  toString() {
    let output = [];
    output.push(`  BT`);
    output.push(`    /${this._fontFamily} ${this._fontSize} Tf`);
    output.push(`    ${this._x} ${this._y} Td`);
    output.push(`    (${this._text}) Tj`);
    output.push(`  ET`);


    return `${(new Stream(output.join("\n")))}`;
  }
}

export default Text;
