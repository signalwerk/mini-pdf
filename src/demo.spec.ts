import Demo from "./demo";

test("general initial test", () => {
  expect(`${Demo()}`).toMatch("Hello World.");
});
