import { question } from 'readline-sync';

console.log('Input format: (<element_1> <element_2> ... <element_n>)');
console.log(
  'Supported sub-elements:\n\tstring: "<value">\n\tnumber: <value>\n\tset: (<value_1> <value_2> ... <value_n>)'
);
console.log('Example: (1 2 5 "asd" "qwe" "B" (5 6 ("C" "D")) 18 19)');
console.log();

function parse(str: string): string {
  const rg = /([^]*)/;

  return (rg.exec(str) || [''])[0];
}

const q = question();
const p = parse(q);

console.log(p);
