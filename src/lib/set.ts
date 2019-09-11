// primitive types
export type Element = string | number | Set;
export type ElementTypes = 'string' | 'number' | 'object';
export type bit = 0 | 1;
export type Vector = bit[];

// basic types
export interface SuperSet {
  elements: Element[];
  hash: string;
}

export interface Set extends SuperSet {
  vector: Vector;
  superset: Set | SuperSet;
}

export type AnySet = Set | SuperSet;

// type guards
export function isSet(obj: any): obj is Set {
  return obj.elements && obj.hash && obj.vector && obj.superset;
}

export function isAnySet(obj: any): obj is AnySet {
  return (
    obj.hash &&
    typeof obj.elements === 'object' &&
    obj.elements.length !== undefined
  );
}

export function isArray(arg: any): arg is any[] {
  return arg.reduce;
}

// errors
export function dublicatesError(arg: Set | Element[]): Error {
  return new Error(
    `Dublicates error. There are dublicates at set: ${getAllDublicates(
      isSet(arg) ? arg.elements : arg
    )}`
  );
}

export function throwDublicatesError(arg: Set | Element[]): true {
  throw dublicatesError(arg);
}

export function typeError(expected: string, received: string): Error {
  return new Error(`Type error. Expected ${expected} but received ${received}`);
}

export function throwTypeError(expected: string, received: string): true {
  throw typeError(expected, received);
}

export function unknownError(): Error {
  return new Error('Unknown error');
}

export function throwUnknownError(): true {
  throw unknownError();
}

export function notSameSupersetError(set1: Set, set2: Set): Error {
  return new Error(
    `NotSameSupersetError. Hash \n"${set1.superset.hash}" is not equal to \n"${set2.superset.hash}"`
  );
}

export function throwNotSameSupersetError(set1: Set, set2: Set): true {
  throw notSameSupersetError(set1, set2);
}

export function supersetError(subset: Set, superset: Set): Error;
export function supersetError(
  subElements: Element[],
  superElements: Element[]
): Error;
export function supersetError(
  subArg: Set | Element[],
  superArg: Set | Element[]
): Error {
  return new Error(
    `Superset error. Expected set to be subset of superset. Diff: ${
      isSet(superArg) && isSet(subArg)
        ? substract(superArg, subArg)
        : !isSet(superArg) && !isSet(subArg)
        ? substract(superArg, subArg)
        : []
    }`
  );
}

export function throwSupersetError(subset: Set, superset: Set): true;
export function throwSupersetError(
  subElements: Element[],
  superElements: Element[]
): true;
export function throwSupersetError(
  arg1: Set | Element[],
  arg2: Set | Element[]
): true {
  throw isSet(arg1) && isSet(arg2)
    ? supersetError(arg1, arg2)
    : !isSet(arg1) && !isSet(arg2)
    ? supersetError(arg1, arg2)
    : throwUnknownError();
}

// like (A \ B)
export function substract(els1: Element[], els2: Element[]): Set;
export function substract(els1: AnySet, els2: AnySet): Set;
export function substract(
  arg1: AnySet | Element[],
  arg2: AnySet | Element[]
): Set {
  return (
    testSupersetsEquality(arg1, arg2) &&
    createSet(
      (isAnySet(arg1) ? arg1.elements : arg1).filter(
        el => !includes(isAnySet(arg2) ? arg2.elements : arg2, el)
      )
    )
  );
}

// check if is superset or supersets a equal
export function testSupersetsEquality(set1: any, set2: any): true {
  return isSet(set1) && isSet(set2)
    ? set1.hash === set2.hash || throwNotSameSupersetError(set1, set2)
    : true;
}

// checks if the set contains another one
export function includes(set1: AnySet, set2: AnySet): boolean;
export function includes(arg1: Element[], arg2: Element | Element[]): boolean;
export function includes(
  arg1: AnySet | Element[],
  arg2: AnySet | Element | Element[]
): boolean {
  return testSupersetsEquality(arg1, arg2) && (isAnySet(arg1) && isAnySet(arg2))
    ? includes(arg1.elements, arg2.elements)
    : !isAnySet(arg1) && !isAnySet(arg2)
    ? isArray(arg2)
      ? arg2.reduce((acc: boolean, val) => acc && includes(arg1, val), true)
      : arg1.reduce(
          (acc: boolean, val) => acc || isElementsEqual(val, arg2),
          false
        )
    : false;
}

// returns U without the set
export function inversion(set: Set): Set {
  return substract(set.superset, set);
}

// elements operands
export function getAllOccurrences(
  elements: Element[],
  element: Element
): Element[] {
  return elements.filter(l => isElementsEqual(element, l));
}

export function getAllDublicates(elements: Element[]): Element[] {
  return elements.filter(el => getAllOccurrences(elements, el).length > 1);
}

export function removeDublicates(elements: Element[]): Element[] {
  return elements.reduce(
    (acc: Element[], val) => [
      ...acc,
      ...(getAllOccurrences(acc, val).length === 0 ? [val] : [])
    ],
    []
  );
}

export function isElementsEqual(el1: Element, el2: Element): boolean {
  const h1 = isSet(el1) ? el1.hash : el1;
  const h2 = isSet(el2) ? el2.hash : el2;

  return h1 === h2;
}

// creators
export function createSuperSet(elements: Element[] = []): SuperSet {
  return {
    elements,
    hash: calcHash(elements)
  };
}

export function createSet(elements: Element[], univesalSet: Set): Set;
export function createSet(
  elements?: Element[],
  univesalSet?: Set | Element[]
): Set;
export function createSet(
  elements: Element[] = [],
  univesalSet?: Set | Element[]
): Set {
  const sorted = elements.slice().sort();

  const superSetElements = univesalSet
    ? isSet(univesalSet)
      ? univesalSet.elements
      : univesalSet
    : sorted;

  const superset: SuperSet =
    univesalSet && isSet(univesalSet)
      ? univesalSet
      : createSuperSet(superSetElements);

  const set: Set = {
    elements: sorted,
    hash: calcHash(sorted),
    superset,
    vector: createVector(
      sorted,
      getAllDublicates(superSetElements).length === 0
        ? superSetElements
        : throwDublicatesError(superSetElements) && superSetElements
    )
  };

  return includes(superSetElements, sorted)
    ? getAllDublicates(sorted).length === 0
      ? set
      : throwDublicatesError(set.elements) && set
    : throwSupersetError(sorted, superSetElements) && set;
}

export function createVector(
  elements: Element[],
  elementsU: Element[]
): Vector {
  return elementsU.map(el => (includes(elements, el) ? 1 : 0));
}

// like (A ⋂ B)
export function intersect(sets: Set[]): Set;
export function intersect(set1: Set, set2: Set): Set;
export function intersect(arg1: Set[] | Set, arg2?: Set): Set {
  const doIntersect = (s1: Set, s2: Set) =>
    createSet(
      removeDublicates([...s1.elements, ...s2.elements]).filter(
        el => includes(s1.elements, el) && includes(s2.elements, el)
      )
    );

  return (
    testSupersetsEquality(arg1, arg2) &&
    (isSet(arg1)
      ? arg2
        ? doIntersect(arg1, arg2)
        : throwTypeError('Set', typeof arg2) && createSet()
      : arg1.reduce((acc, val) => intersect(acc, val)))
  );
}

// like (A ∪ B)
export function merge(sets: Set[]): Set;
export function merge(set1: Set, set2: Set): Set;
export function merge(arg1: Set[] | Set, arg2?: Set): Set {
  const doMerge = (s1: Set, s2: Set) =>
    createSet(removeDublicates([...s1.elements, ...s2.elements]));

  return (
    testSupersetsEquality(arg1, arg2) &&
    (isSet(arg1)
      ? arg2
        ? doMerge(arg1, arg2)
        : throwTypeError('Set', typeof arg2) && createSet()
      : arg1.reduce((acc, val) => merge(acc, val)))
  );
}

const hashGettingMap = {
  number: (num: any) => num.toString(),
  object: (obj: any) =>
    isSet(obj) ? obj.hash : throwTypeError('Set', 'non-Set') && obj,
  string: (str: any) => str
};

// calculates hash for an element sequence
export function calcHash(elements: Element[]): string {
  function keyValidityChecker(key: string): key is ElementTypes {
    return key === 'number' || key === 'object' || key === 'string';
  }

  const hash = `(${
    elements.length
      ? elements
          .map(elem => {
            const type = typeof elem;

            if (!keyValidityChecker(type)) throw new Error();

            return hashGettingMap[type](elem);
          })
          .join('_')
      : 'empty'
  })`;

  return hash;
}
