import { AnySet, createSet, Element } from '../lib/set';

console.log('Input format: (<element_1> <element_2> ... <element_n>)');
console.log(
  'Supported sub-elements:\n\tstring: <value>\n\tnumber: <value>\n\tset: (<value_1> <value_2> ... <value_n>)'
);
console.log('Example: (1 2 5 asd qwe B (5 6 (C D)) 18 19)');
console.log();

function parse(
  str: string,
  left: string[][] = [],
  right: string[][] = []
): string[][] {
  const arr = Array.from(str);
  const firstBrackerI = arr.findIndex(el => el === '(');
  const lastBrackerI =
    arr.length -
    1 -
    arr
      .slice()
      .reverse()
      .findIndex(el => el === ')');

  if (firstBrackerI === -1 || lastBrackerI === -1)
    return [...left, str.split(' '), ...right];

  const inner = str.slice(firstBrackerI + 1, lastBrackerI);
  const addLeft = str.slice(0, firstBrackerI);
  const addRight = str.slice(lastBrackerI + 1, arr.length);

  return parse(
    inner,
    [...left, addLeft.split(' ')],
    [addRight.split(' '), ...right]
  );
}

const p = parse('(1 2 5 asd qwe B (5 6 (C D) 33) (A B C) 18 19)');
console.log(p);

const halfLength = Math.floor(p.length / 2);
const set: AnySet = new Array(halfLength)
  .fill(null)
  .reduce((acc: Element, _, i) => {
    function str2elems(str: string[]): Element[] {
      return str.map(c => (isNaN(parseInt(c)) ? c : parseInt(c)));
    }

    const reversedLevel = halfLength - i;
    if (i === 0) return createSet(str2elems(p[reversedLevel]));

    const left = p[reversedLevel];
    const right = p[p.length - 1 - reversedLevel];
    const all = [...left, ...right].filter(s => s.length);

    return createSet([...str2elems(all), acc]);
  }, null);

console.log(set.hash);
