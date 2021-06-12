export function pad(num: number, size: number) {
  var s = `${num}`;
  while (s.length < size)
    s = `0${s}`;
  return s;
}
