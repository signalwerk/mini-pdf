import Writer from "./Writer";
import Text from "./Text";
import Pages from "./Pages";
import Page from "./Page";
import Catalog from "./Catalog";

class MiniPdf {
  constructor() {
    this.writer = new Writer();
  }

  toString() {
    let writer = this.writer;

    let catalog = new Catalog();
    let pages = new Pages().mediaBox([0, 0, 300, 144]);
    let page = new Page();

    pages.addPage(page);
    catalog.addPages(pages);

    let text = new Text("Hello World").fontSize(18).fontFamily("F1");

    page.addContent(text);

    writer.addObj(catalog);

    // return `${this.writer}`;
    return `${this.writer}`;
  }
}

export default MiniPdf;
