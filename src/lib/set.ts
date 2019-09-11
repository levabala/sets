export type Element = string | number | Set;
export type ElementTypes = 'string' | 'number' | 'object';
export type bit = 0 | 1;
export type Vector = bit[];

export interface Set {
  elements: Element[];
  hash: string;
  vector: Vector;
}

export function isSet(obj: any): obj is Set {
  return (
    obj.hash &&
    typeof obj.elements === 'object' &&
    obj.elements.length !== undefined
  );
}

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

export function substract(els1: Element[], els2: Element[]): Set;
export function substract(els1: Set, els2: Set): Set;
export function substract(arg1: Set | Element[], arg2: Set | Element[]): Set {
  return createSet(
    (isSet(arg1) ? arg1.elements : arg1).filter(
      el => !includes(isSet(arg2) ? arg2.elements : arg2, el)
    )
  );
}

export function includes(arg1: Element[], arg2: Element | Element[]): boolean {
  return isArray(arg2)
    ? arg2.reduce((acc: boolean, val) => acc && includes(arg1, val), true)
    : arg1.reduce(
        (acc: boolean, val) => acc || isElementsEqual(val, arg2),
        false
      );
}

function isArray(arg: any): arg is any[] {
  return arg.reduce;
}

export function getAllOccurrences(
  elements: Element[],
  element: Element
): Element[] {
  return elements.filter(l => isElementsEqual(element, l));
}

export function getAllDublicates(elements: Element[]): Element[] {
  return elements.filter(el => getAllOccurrences(elements, el).length > 1);
}

export function isElementsEqual(el1: Element, el2: Element): boolean {
  const h1 = isSet(el1) ? el1.hash : el1;
  const h2 = isSet(el2) ? el2.hash : el2;

  return h1 === h2;
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

  const set = {
    elements: sorted,
    hash: calcHash(sorted),
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

export function removeDublicates(elements: Element[]): Element[] {
  return elements.reduce(
    (acc: Element[], val) => [
      ...acc,
      ...(getAllOccurrences(acc, val).length === 0 ? [val] : [])
    ],
    []
  );
}

export function intersect(sets: Set[]): Set;
export function intersect(set1: Set, set2: Set): Set;
export function intersect(arg1: Set[] | Set, arg2?: Set): Set {
  const doIntersect = (s1: Set, s2: Set) =>
    createSet(
      removeDublicates([...s1.elements, ...s2.elements]).filter(
        el => includes(s1.elements, el) && includes(s2.elements, el)
      )
    );

  return isSet(arg1)
    ? arg2
      ? doIntersect(arg1, arg2)
      : throwTypeError('Set', typeof arg2) && createSet()
    : arg1.reduce((acc, val) => intersect(acc, val));
}

export function merge(sets: Set[]): Set;
export function merge(set1: Set, set2: Set): Set;
export function merge(arg1: Set[] | Set, arg2?: Set): Set {
  const doMerge = (s1: Set, s2: Set) =>
    createSet(removeDublicates([...s1.elements, ...s2.elements]));

  return isSet(arg1)
    ? arg2
      ? doMerge(arg1, arg2)
      : throwTypeError('Set', typeof arg2) && createSet()
    : arg1.reduce((acc, val) => merge(acc, val));
}

const hashGettingMap = {
  number: (num: any) => num.toString(),
  object: (obj: any) =>
    isSet(obj) ? obj.hash : throwTypeError('Set', 'non-Set') && obj,
  string: (str: any) => str
};

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
