import { layoutTextBox } from ".";

test("wraps and clips text inside a textbox", () => {
  const lines = layoutTextBox({
    x: 10,
    y: 20,
    width: 30,
    height: 20,
    lineHeight: 8,
    size: 6,
    font: "F1",
    content: "one two three four five six seven",
  });

  expect(lines.length).toBeGreaterThan(1);
  expect(lines.every(({ x, y }) => x === 10 && y <= 40)).toBe(true);
});

test("positions end-anchored textbox lines against the right edge", () => {
  const [line] = layoutTextBox({
    x: 10,
    y: 20,
    width: 80,
    height: 20,
    lineHeight: 10,
    size: 10,
    font: "F1",
    content: "end",
    textAnchor: "end",
  });

  expect(line.x).toBeGreaterThan(10);
  expect(line.x).toBeLessThan(90);
});

test("wraps Work Sans label copy before it crosses the right edge", () => {
  const lines = layoutTextBox({
    x: 6,
    y: 100,
    width: 78,
    height: 26,
    lineHeight: 3.12,
    size: 2.6,
    font: "WorkSansSemiBold",
    content:
      "2001: A Space Odyssey is a 1968 science fiction film produced and directed by Stanley Kubrick.",
  });

  expect(lines.map(({ content }) => content)).toEqual([
    "2001: A Space Odyssey is a 1968 science fiction film",
    "produced and directed by Stanley Kubrick.",
  ]);
});
