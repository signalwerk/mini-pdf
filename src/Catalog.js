class Catalog {
  constructor() {
    this._pages = null;
    this._obj = null;
  }

  addPages(pages) {
    let newPages = pages;
    newPages.parent(this);
    this._pages = newPages;
    return this;
  }

  onAddObj(currentObj) {
    this._obj = currentObj;
    currentObj.writer.addObj(this._pages);
  }

  toString() {
    let output = [];
    output.push(`  << /Type /Catalog`);
    output.push(
      `     /Pages ${this._pages._obj.id} ${this._pages._obj.generation} R`
    );
    output.push(`  >>`);
    return output.join("\n");
  }
}

export default Catalog;
