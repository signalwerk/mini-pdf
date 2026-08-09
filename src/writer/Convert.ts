import { convert as convertOfImage } from "../image";
import { AstTypesEnum, AstTypes, Viewport } from "../structure";
import { pdfArray } from "../dataTypes/array";
import { pdfName } from "../dataTypes/name";
import { Ref } from "../dataTypes/reference";
import { PdfPdf, PdfTypes, PdfType } from "../dataTypes/pdf";
import {
  PdfDictonary,
  pdfDictionary,
  pdfDictionaryPair,
} from "../dataTypes/dictonary";
import { TextLine } from "../generators/TextLine";
import { ShapedTextLine } from "../generators/ShapedTextLine";
import { Catalog } from "../generators/Catalog";
import { FontHelvetica } from "../generators/FontHelvetica";
import { Page } from "../generators/Page";
import { Pages } from "../generators/Pages";
import { InfoDictionary } from "../generators/Info";
import { Stream } from "../dataTypes/stream";
import { PdfReference } from "../dataTypes/reference/";
import { EmbeddedFont } from "../font";

type ConvertContext = {
  embeddedFonts: { [fontId: string]: EmbeddedFont };
};

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
  parentObj?: Viewport,
  context: ConvertContext = { embeddedFonts: {} },
) => {
  switch (obj.type) {
    case AstTypesEnum.DOCUMENT: {
      const { ref: refCatalog } = addObj(pdf, null);
      const { ref: pageInventoryRef } = addObj(pdf, null);

      const catalog = Catalog(pageInventoryRef);
      replaceObj(pdf, refCatalog, catalog);

      if (obj.info) {
        const { ref: refInfo } = addObj(pdf, InfoDictionary(obj.info));
        pdf.info = refInfo;
      }

      const pagesRef = [];

      obj.fonts.forEach((font, index) => {
        if (pdf.fonts[font.id]) {
          throw new Error(`Duplicate font id: "${font.id}".`);
        }

        const embeddedFont = font.data
          ? new EmbeddedFont(font.data, font.id, index)
          : null;
        const { ref: refFont } = addObj(
          pdf,
          embeddedFont ? null : FontHelvetica(pdfName(font.id)),
        );

        pdf.fonts[font.id] = refFont;
        if (embeddedFont) {
          context.embeddedFonts[font.id] = embeddedFont;
        }
      });

      obj.children.forEach((page) => {
        const { ref: refPage } = addObj(pdf, null);
        const pageItem = Convert(
          pdf,
          page,
          pageInventoryRef,
          undefined,
          context,
        ) as PdfDictonary;
        pagesRef.push(refPage);
        replaceObj(pdf, refPage, pageItem);
      });

      replaceObj(pdf, pageInventoryRef, Pages(pagesRef));

      Object.entries(context.embeddedFonts).forEach(([fontId, font]) => {
        const { ref: fontFileRef } = addObj(pdf, font.fontFile());
        const { ref: descriptorRef } = addObj(
          pdf,
          font.descriptor(fontFileRef),
        );
        const { ref: descendantRef } = addObj(
          pdf,
          font.descendantFont(descriptorRef),
        );
        const { ref: toUnicodeRef } = addObj(pdf, font.toUnicode());

        replaceObj(
          pdf,
          pdf.fonts[fontId],
          font.type0Font(descendantRef, toUnicodeRef),
        );
      });

      return;
    }
    case AstTypesEnum.VIEWPORT: {
      const { ref: refRes } = addObj(pdf, null);

      const { ref: refContent } = addObj(pdf, null);

      const values = [];
      const fontItems = [];
      const xObjectItems: Array<{ name: string; ref: PdfReference }> = [];

      obj.children.forEach((item) => {
        const contentItem = Convert(pdf, item, refContent, obj, context) as {
          value: Array<PdfType>;
          fonts?: Array<string>;
          xObjects?: Array<{ name: string; ref: PdfReference }>;
        };
        if (contentItem.fonts) {
          fontItems.push(...contentItem.fonts);
        }
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
            ]),
          ),

          pdfDictionaryPair(
            pdfName("Font"),
            pdfDictionary(
              Array.from(new Set(fontItems)).map((font) =>
                pdfDictionaryPair(pdfName(font), pdf.fonts[font]),
              ),
            ),
          ),
          pdfDictionaryPair(
            pdfName("XObject"),
            pdfDictionary(
              xObjectItems.map(({ name, ref }) =>
                pdfDictionaryPair(pdfName(name), ref),
              ),
            ),
          ),
        ]),
      );

      const page = Page(parent, refRes, obj.attributes.mediaBox, [refContent]);

      return page;
    }
    case AstTypesEnum.IMAGE: {
      const { ref: refImg } = addObj(pdf, null);
      const name = `Im${refImg.id}`;
      const { img, imageObject } = convertOfImage(obj, parentObj, name);

      replaceObj(pdf, refImg, imageObject);
      return { value: img, xObjects: [{ name, ref: refImg }] };
    }
    case AstTypesEnum.TEXT: {
      const fontId = obj.attributes.font;
      if (!pdf.fonts[fontId]) {
        throw new Error(`Unknown font id: "${fontId}".`);
      }

      const embeddedFont = context.embeddedFonts[fontId];
      const textLine = embeddedFont
        ? ShapedTextLine({
            x: obj.attributes.x,
            y: obj.attributes.y,
            size: obj.attributes.size,
            font: fontId,
            unitsPerEm: embeddedFont.unitsPerEm,
            glyphs: embeddedFont.shape(
              obj.attributes.content,
              obj.attributes.features,
            ),
          })
        : TextLine({
            x: obj.attributes.x,
            y: obj.attributes.y,
            size: obj.attributes.size,
            font: fontId,
            content: obj.attributes.content,
          });

      return { value: textLine, fonts: [fontId] };
    }
  }
};
