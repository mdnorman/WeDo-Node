'use strict';

/**
 * Return the index where to insert item x in list a, assuming a is sorted.
 * 
 * The return value i is such that all e in a[:i] have e < x, and all e in
 * a[i:] have e >= x.  So if x already appears in the list, a.insert(x) will
 * insert just before the leftmost x already there.
 * 
 * Optional args low (default 0) and high (default len(array)) bound the slice of a to be searched.
 * 
 * @param {Array} array sorted array of numbers
 * @param {number} x item to be added to the array.
 * @param {number} low optional index to start searching.
 * @param {number} high optional index to stop searching.
 * 
 * @return {number} the index to insert
 */
const bisectLeft = function left(array, x, low , high) {
  low = low || 0;
  high = high || array.length;

  var mid;

  while (low < high) {
    mid = (low + high) >> 1;

    if (array[mid] < x) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  return low;
};

module.exports = {
  bisectLeft
};
