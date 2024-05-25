export function arraysAreEqual<T>(arr1: T[], arr2: T[]): boolean {
  // Check if arrays have same length
  if (arr1.length !== arr2.length) {
    return false;
  }

  // Check if each element in the arrays is the same
  return arr1.every((element, index) => element === arr2[index]);
}
