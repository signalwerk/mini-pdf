import { convert as convertOfImage } from "../image";
import { Viewport } from "../dataTypes/Ast/Viewport";
import { AstTypesEnum, AstTypes } from "../dataTypes/Ast/";
import { pdfArray } from "../dataTypes/pdf/array";
import { pdfName } from "../dataTypes/pdf/name";
import { Ref } from "../dataTypes/pdf/reference";
import { PdfPdf, PdfTypes, PdfType } from "../dataTypes/pdf/";
import {
  PdfDictonary,
  pdfDictionary,
  pdfDictionaryPair,
} from "../dataTypes/pdf/dictonary";
import { TextLine } from "../generator/pdf/TextLine";
import { Catalog } from "../generator/pdf/Catalog";
import { FontHelvetica } from "../generator/pdf/FontHelvetica";
import { Page } from "../generator/pdf/Page";
import { Pages } from "../generator/pdf/Pages";
import { Stream } from "../dataTypes/pdf/stream";
import { PdfReference } from "../dataTypes/pdf/reference/";

const countObj = (pdf: PdfPdf) => {
  return pdf.objects.length;
};

const addObj = (pdf: PdfPdf, object: PdfTypes) => {
  const refId = countObj(pdf) + 1;

  pdf.objects.push(object);

  return {
    ref: Ref(refId),
  };
};

const replaceObj = (pdf: PdfPdf, ref: PdfReference, object: PdfTypes) => {
  pdf.objects[ref.id - 1] = object;

  return {
    ref,
  };
};

export const Convert = (
  pdf: PdfPdf,
  obj: AstTypes,
  parent?: PdfReference,
  parentObj?: Viewport
) => {
  switch (obj.type) {
    case AstTypesEnum.DOCUMENT: {
      const { ref: refCatalog } = addObj(pdf, null);
      const { ref: pageInventoryRef } = addObj(pdf, null);

      const catalog = Catalog(pageInventoryRef);
      replaceObj(pdf, refCatalog, catalog);

      const pagesRef = [];

      obj.fonts.forEach((font) => {
        const { ref: refFont } = addObj(pdf, FontHelvetica(pdfName(font.id)));

        pdf.fonts[font.id] = refFont;
      });

      obj.children.forEach((page) => {
        const { ref: refPage } = addObj(pdf, null);
        const pageItem = Convert(pdf, page, pageInventoryRef) as PdfDictonary;
        pagesRef.push(refPage);
        replaceObj(pdf, refPage, pageItem);
      });

      replaceObj(pdf, pageInventoryRef, Pages(pagesRef));

      return;
    }
    case AstTypesEnum.VIEWPORT: {
      const { ref: refRes } = addObj(pdf, null);

      const { ref: refContent } = addObj(pdf, null);

      const values = [];
      const fontItems = [];
      const xObjectItems = [];

      obj.children.forEach((item) => {
        const contentItem = Convert(pdf, item, refContent, obj) as {
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
      replaceObj(pdf, refContent, Stream(values));

      replaceObj(
        pdf,
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
                pdfDictionaryPair(pdfName(font), pdf.fonts[font])
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
    }
    case AstTypesEnum.IMAGE: {
      const { ref: refImg } = addObj(pdf, null);
      // const { ref: refContentItem } = addObj(pdf, null);
      const { img, refImgNew } = convertOfImage(obj, parentObj);

      replaceObj(pdf, refImg, refImgNew);
      // replaceObj(pdf, refContentItem, refContentItemNew);
      return { value: img, xObjects: [refImg] };
    }
    case AstTypesEnum.TEXT: {
      const textLine = TextLine({
        x: obj.attributes.x,
        y: obj.attributes.y,
        size: obj.attributes.size,
        font: obj.attributes.font,
        content: obj.attributes.content,
      });

      return { value: textLine, fonts: [obj.attributes.font] };
    }
  }
};
