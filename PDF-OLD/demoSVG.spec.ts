import Demo from "./demoSVG";

test("general initial test", () => {
  expect(`${Demo()}`).toMatch("Hello World. SVG");
});
