import { convert as convertOfImage } from "../image";
import { AstTypesEnum, AstTypes, Viewport } from "../../data/structure";
import { pdfArray } from "../dataTypes/array";
import { pdfName } from "../dataTypes/name";
import {
  PdfDictonary,
  pdfDictionary,
  pdfDictionaryPair,
} from "../dataTypes/dictonary";
import { TextLine } from "../generators/TextLine";
import { addObj, replaceObj, PdfType } from "../index";
import { PDF } from "../demo";
import { Catalog } from "../generators/Catalog";
import { FontHelvetica } from "../generators/FontHelvetica";
import { Page } from "../generators/Page";
import { Pages } from "../generators/Pages";
import { Stream } from "../dataTypes/stream";
import { PdfReference } from "../dataTypes/reference/";

export const Convert = (
  obj: AstTypes,
  parent?: PdfReference,
  parentObj?: Viewport
) => {
  switch (obj.type) {
    case AstTypesEnum.DOCUMENT:
      const { ref: refCatalog } = addObj(null);
      const { ref: pageInventoryRef } = addObj(null);

      const catalog = Catalog(pageInventoryRef);
      replaceObj(refCatalog, catalog);

      const pagesRef = [];

      obj.fonts.forEach((font) => {
        const { ref: refFont } = addObj(FontHelvetica(pdfName(font.id)));

        PDF.fonts[font.id] = refFont;
      });

      obj.children.forEach((page) => {
        const { ref: refPage } = addObj(null);
        const pageItem = Convert(page, pageInventoryRef) as PdfDictonary;
        pagesRef.push(refPage);
        replaceObj(refPage, pageItem);
      });

      replaceObj(pageInventoryRef, Pages(pagesRef));

      return;

    case AstTypesEnum.VIEWPORT:
      const { ref: refRes } = addObj(null);

      const { ref: refContent } = addObj(null);

      const values = [];
      const fontItems = [];
      const xObjectItems = [];

      obj.children.forEach((item) => {
        const contentItem = Convert(item, refContent, obj) as {
          value: Array<PdfType>;
          fonts?: Array<string>;
          xObjects?: Array<PdfReference>;
        };
        fontItems.push(...contentItem.fonts);
        if (contentItem.value) {
          values.push(...contentItem.value);
        }

        if (contentItem.xObjects) {
          xObjectItems.push(...contentItem.xObjects);
        }
      });
      replaceObj(refContent, Stream(values));

      replaceObj(
        refRes,
        pdfDictionary([
          pdfDictionaryPair(
            pdfName("ProcSet"),
            pdfArray([
              pdfName("PDF"),
              pdfName("Text"),
              pdfName("ImageB"),
              pdfName("ImageC"),
              pdfName("ImageI"),
            ])
          ),

          pdfDictionaryPair(
            pdfName("Font"),
            pdfDictionary(
              fontItems.map((font) =>
                pdfDictionaryPair(pdfName(font), PDF.fonts[font])
              )
            )
          ),
          pdfDictionaryPair(
            pdfName("XObject"),
            pdfDictionary(
              xObjectItems.map((xObject) =>
                pdfDictionaryPair(pdfName("I1"), xObject)
              )
            )
          ),
        ])
      );

      const page = Page(parent, refRes, obj.attributes.mediaBox, [refContent]);

      return page;

    case AstTypesEnum.IMAGE:
      const { ref: refImg } = addObj(null);
      // const { ref: refContentItem } = addObj(null);
      const ImgId = "I1";
      const { img, refImgNew } = convertOfImage(obj, parentObj);

      replaceObj(refImg, refImgNew);
      // replaceObj(refContentItem, refContentItemNew);
      return { value: img, xObjects: [refImg] };

    case AstTypesEnum.TEXT:
      const textLine = TextLine({
        x: obj.attributes.x,
        y: obj.attributes.y,
        size: obj.attributes.size,
        font: obj.attributes.font,
        content: obj.attributes.content,
      });

      return { value: textLine, fonts: [obj.attributes.font] };
  }
};
