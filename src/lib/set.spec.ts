import test from 'ava';

import {
  calcHash,
  createSet,
  dublicatesError,
  includes,
  intersect,
  merge,
  removeDublicates,
  substract,
  supersetError,
} from './set';

test('Includes', t => {
  const b1 = includes([1, 2, 3], 1);
  t.is(b1, true, 'number');

  const b2 = includes([1, 2, 3], 4);
  t.is(b2, false, 'number exclude');

  const b3 = includes([createSet([1])], createSet([1]));
  t.is(b3, true, 'set');

  const b4 = includes([1, 2, 3], [1, 2]);
  t.is(b4, true, 'numbers array');

  const b5 = includes([1, 2, 3], [1, 4]);
  t.is(b5, false, 'numbers array exclude');
});

test('Hash calculating', t => {
  const hash = calcHash(['asd', 'a', 123, createSet([]), createSet([123, 33])]);

  t.is(hash, '(asd_a_123_(empty)_(123_33))', 'hash');
});

test('Spec creating', t => {
  const emptySet = createSet([]);
  t.deepEqual(
    emptySet,
    { hash: '(empty)', elements: [], vector: [] },
    'empty set'
  );

  const filledSet = createSet([132, 33]);
  t.deepEqual(
    filledSet,
    { hash: calcHash(filledSet.elements), elements: [132, 33], vector: [1, 1] },
    'message'
  );
});

test('Dublicates', t => {
  const els1 = [1, 1, 3];
  const els2 = [createSet([8, 6]), createSet([8, 6]), createSet([8, 7])];
  t.throws(() => createSet(els1), dublicatesError(els1).message, 'numbers');
  t.throws(() => createSet(els2), dublicatesError(els2).message, 'numbers');

  const s1 = [123, 33];
  const s2 = ['asd', 33];

  const a = [...s1, ...s2];
  const b = removeDublicates(a);

  t.deepEqual(b, [123, 33, 'asd'], 'removing');
});

test('Supersets', t => {
  const subsetEls1 = [4, 3, 2];
  const supersetEls1 = [2];
  t.throws(
    () => {
      createSet(subsetEls1, supersetEls1);
    },
    supersetError(subsetEls1, supersetEls1).message,
    'numbers'
  );

  const subsetEls2 = [
    createSet([1, 2, 3]),
    createSet([1, 7, 8]),
    createSet([9, 4, 1])
  ];
  const supersetEls2 = [createSet([1, 2, 3])];
  t.throws(
    () => {
      createSet(subsetEls2, supersetEls2);
    },
    supersetError(subsetEls2, supersetEls2).message,
    'sets'
  );
});

test('Vectors creating', t => {
  const v1 = createSet([]).vector;
  t.deepEqual(v1, [], 'empty arr');

  const v2 = createSet([4, 3, 9], [4, 3, 8, 9, 6]).vector;
  t.deepEqual(v2, [1, 1, 0, 1, 0], 'numbers');

  const v3 = createSet(
    [createSet([1, 2, 3]), createSet([1, 7, 8]), createSet([9, 4, 1])],
    [
      createSet([1, 2, 3]),
      createSet([1, 7, 8]),
      createSet([9, 4, 1]),
      createSet([6, 7]),
      123
    ]
  ).vector;
  t.deepEqual(v3, [1, 1, 1, 0, 0], 'sets');
});

test('Merging', t => {
  const s1 = createSet([123, 33]);
  const s2 = createSet(['asd', 33]);

  const m1_1 = merge([s1, s2]);
  const m1_2 = merge(s1, s2);

  t.deepEqual(m1_1, m1_2, 'merge overloadings');
  t.is(m1_1.hash, calcHash([123, 33, 'asd']), 'merge');
});

test('Intersect', t => {
  const s1 = createSet([123, 33]);
  const s2 = createSet(['asd', 33]);

  const i1_1 = intersect([s1, s2]);
  const i1_2 = intersect(s1, s2);

  t.deepEqual(i1_1, i1_2, 'intersect overloadings');
  t.is(i1_1.hash, calcHash([33]), 'intersect');
});

test('Substract', t => {
  const s1 = createSet([123, 33]);
  const s2 = createSet(['asd', 33]);

  const r1_1 = substract(s1, s2);
  const r1_2 = substract(s1.elements, s2.elements);

  t.deepEqual(r1_1, r1_2, 'substract overloadings');
  t.is(r1_1.hash, calcHash([123]), 'substract');
});
