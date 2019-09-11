import { createSet, createSuperSet, merge } from './set';


function declareModule(moduleName: string): void {
  console.log(`\nModule "${moduleName}"\n`);
}

function say(message: any, title?: string): void {
  if (title) console.log(`${title}:`);

  console.log(message);
}

/* ----- Sets initialization ----- */
declareModule('Set initialization');

// simple initialization (by default U is equal to set elements)
const set1 = createSet([1, 2, 3]);
say(set1, 'simple set');

// set with superset
const set2 = createSet([1, 2, 3], [1, 2, 3, 4, 5]);
say(set1, 'set with superset');

/* ----- Sets operations ----- */
declareModule('Sets operations');

// merging sets
try {
  merge(set1, set2); // will throw a error because supersets are not equal
} catch (e) {
  say(
    (e as Error).message,
    'merging with differeent supersets cause the error'
  );
}

// create a superset as U = { x | x ∈ N, x < 100}
const numericU = createSuperSet(new Array(100).fill(null).map(i => i));

// create some subsets of U
const set3 = createSet([1, 2, 3], numericU);
const set4 = createSet([2, 3, 4], numericU);

try {
  createSet([1, 108], numericU); // will throw a error because number 108 is not under numericU superset
} catch (e) {
  say(
    (e as Error).message,
    "creating set with elements that aren't under superset cause the error"
  );
}

// do merge, intersect and substract

// to be continued...
