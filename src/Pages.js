class Pages {
  constructor() {
    this._mediaBox = [0, 0, 10, 10];
    this._pages = [];
    this._obj = null;
  }

  parent(parent) {
    this._parent = parent;
    return this;
  }

  mediaBox(mediaBox) {
    this._mediaBox = mediaBox;
    return this;
  }

  addPage(page) {
    let newPage = page;
    newPage.parent(this);
    this._pages.push(page);
    return this;
  }

  onAddObj(currentObj) {
    this._obj = currentObj;

    this._pages.forEach(page => {
      currentObj.writer.addObj(page);
    });
  }

  toString() {
    let output = [];

    output.push(`  << /Type /Pages`);

    this._pages.forEach(page => {
      console.log("page", page);
      output.push(`     /Kids [${page._obj.id} ${page._obj.generation} R]`);
    });

    output.push(`     /Count ${this._pages.length}`);
    output.push(`     /MediaBox [${this._mediaBox.join(" ")}]`);
    output.push(`  >>`);
    return output.join("\n");
  }
}

export default Pages;
