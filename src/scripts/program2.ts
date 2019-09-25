const p1 = [1, 2, 3];
const p2 = [1, 3, 2];
const p3 = [2, 1, 3];
const p4 = [2, 3, 1];
const p5 = [3, 1, 2];
const p6 = [3, 2, 1];

const m = { p1, p2, p3, p4, p5, p6 };

function doThings(m1: number[], m2: number[]): number[] {
  return m2.map(v => v - 1).map(el => m1[el]);
}

function find(p: number[]): string {
  return (Object.entries(m).find(
    ([_, value]) => value.toString() === p.toString()
  ) || ['nani?', 'nani?'])[0] as string;
}

const configs = Object.values(m).map(m1 =>
  Object.values(m).map(m2 => [m1, m2])
);
const results = configs.map(row =>
  row.map(([m1, m2]) => doThings(m1, m2)).map(p => find(p))
);

const str = [
  ['  ', ...Object.keys(m)].join(' '),
  ...results.map((r, i) => [`p${i + 1}`, ...r].join(' '))
].join('\n');

console.log(str);
