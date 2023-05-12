export const checkIfStringContainsSpaceInStartAndEnd = (
    str: string
): Boolean => {
    return str.startsWith(" ") || str.endsWith(" ");
};

/**
 * @param {number|string} a
 * @param {number|string} b
 */
export const defaultSort = (a, b) => {
    if (a < b) return 1;
    if (b < a) return -1;
    return 0;
};

export const Sorter = {
    DEFAULT: defaultSort,
};
