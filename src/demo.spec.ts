import DOC from "../data/structure";
import { Writer } from "./writer/";

test("general initial test", () => {
  expect(`${Writer(DOC)}`).toMatch("Hello World.");
});
