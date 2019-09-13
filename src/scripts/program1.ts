import { question } from 'readline-sync';

import { createSet, createSuperSet, Element, equalV, set2str, substract } from '../lib/set';

console.log('Input format: <element_1> <element_2> ... <element_n>');
// operations: A \ B, A = B

function str2elems(str: string[]): Element[] {
  return str
    .filter(s => s.length)
    .map(c => (isNaN(parseInt(c)) ? c : parseInt(c)));
}

try {
  const els1 = str2elems(question('Enter global superset: ').split(' '));
  const superset = createSuperSet(els1);

  const els2 = str2elems(question('Enter A set: ').split(' '));
  const setA = createSet(els2, superset);
  console.log(setA.vector);

  const els3 = str2elems(question('Enter B set: ').split(' '));
  const setB = createSet(els3, superset);
  console.log(setB.vector);

  const res1 = substract(setA, setB);
  const res2 = equalV(setA, setB);

  console.log(`(A \\ B) == ${set2str(res1)}`);
  console.log(`(A = B) == ${res2}`);
} catch (e) {
  console.log((e as Error).message);
}
