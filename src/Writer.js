import Header from "./Header";
import Obj from "./Obj";

function pad( num, size) {
  var s = `${num}`;
  while (s.length < size) s = `0${s}`;
  return s;
}

class Writer {
  constructor() {
    this.header = new Header();
    this.obj = [];
  }
  addObj(content) {
    let id = this.obj.length + 1;
    let newObj = new Obj(id, content, this);

    this.obj.push(newObj);

    if (content.onAddObj) {
      content.onAddObj(newObj);
    }

    return newObj;
  }

  render(obj) {
    let content = `${obj}`;

    let length = new Blob([content]).size; // -> 4

    // let length = content.length;
    return { content, length };
  }

  toString() {
    let output = [];
    let length = [];

    let header = this.render(this.header);
    output.push(header.content);
    length.push(header.length);

    this.obj.forEach(item => {
      let current = this.render(item);
      output.push(current.content);
      length.push(current.length);
    });

    let _xref = [];

    _xref.push(`xref`);
    _xref.push(`0 ${output.length}`);
    _xref.push(`${pad(0, 10)} 65535 f\n`);

    let xref = this.render(_xref.join("\n"));
    output.push(xref.content);
    length.push(xref.length);

    let offset = 0;
    output.slice(0,this.obj.length).forEach((item, index) => {
      offset += length[index];
      output.push(`${pad(offset, 10)} 00000 n\n`);
    });

let _trailer = []
    _trailer.push(`trailer`);
    _trailer.push(`  <<  /Root 1 0 R`);
    _trailer.push(`      /Size 5`);
    _trailer.push(`  >>`);

    _trailer.push(`startxref`);
    _trailer.push(`${offset + length[this.obj.length ]}`);
    _trailer.push(`%%EOF`);

    let trailer = this.render(_trailer.join("\n"));
    output.push(trailer.content);
    length.push(trailer.length);

    console.log({ length });

    return `${output.join("")}`;
  }
}

export default Writer;
