class Page {
  constructor(kids) {
    this._contents = [];
    this._parent = null;
    this._obj = null;
  }
  parent(parent) {
    this._parent = parent;
    return this;
  }

  addContent(content) {
    let newContent = content;
    newContent.parent(this);
    this._contents.push(newContent);
    return this;
  }

  onAddObj(currentObj) {
    this._obj = currentObj;
    this._contents.forEach(content => {
      currentObj.writer.addObj(content);
    });
  }

  toString() {
    let output = [];

    output.push(`  <<  /Type /Page`);
    output.push(
      `      /Parent ${this._parent._obj.id} ${this._parent._obj.generation} R`
    );
    output.push(`      /Resources`);
    output.push(`       << /Font`);
    output.push(`           << /F1`);
    output.push(`               << /Type /Font`);
    output.push(`                  /Subtype /Type1`);
    output.push(`                  /BaseFont /Times-Roman`);
    output.push(`               >>`);
    output.push(`           >>`);
    output.push(`       >>`);

console.log("contents", this._contents)
    this._contents.forEach(content => {
      output.push(
        `      /Contents ${content._obj.id} ${content._obj.generation} R`
      );
    });
    output.push(`  >>`);

    return output.join("\n");
  }
}

export default Page;
