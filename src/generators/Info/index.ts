import {
  PdfDictonary,
  pdfDictionary,
  pdfDictionaryPair,
} from "../../dataTypes/dictonary";
import { pdfName } from "../../dataTypes/name";
import { pdfString } from "../../dataTypes/string";
import { pdfDate } from "../../dataTypes/date";
import { Info } from "../../structure";

// AST field → PDF key, in the order the spec lists them.
const TEXT_FIELDS: Array<[keyof Info, string]> = [
  ["title", "Title"],
  ["author", "Author"],
  ["subject", "Subject"],
  ["keywords", "Keywords"],
  ["creator", "Creator"],
  ["producer", "Producer"],
];

const DATE_FIELDS: Array<[keyof Info, string]> = [
  ["creationDate", "CreationDate"],
  ["modDate", "ModDate"],
];

/**
 * Build the `/Info` dictionary from document metadata. Only the fields that are
 * set produce an entry, so an empty `Info` yields an empty dictionary.
 */
export const InfoDictionary = (info: Info): PdfDictonary =>
  pdfDictionary([
    ...TEXT_FIELDS.flatMap(([field, key]) =>
      info[field] === undefined
        ? []
        : [pdfDictionaryPair(pdfName(key), pdfString(info[field] as string))],
    ),
    ...DATE_FIELDS.flatMap(([field, key]) =>
      info[field] === undefined
        ? []
        : [
            pdfDictionaryPair(
              pdfName(key),
              pdfDate(info[field] as Date | string),
            ),
          ],
    ),
  ]);
