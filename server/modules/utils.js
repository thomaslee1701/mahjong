function identity(x) {
    return x
}

/**
 * Insertion sort
 * @param {Array} arr 
 * @param {function} func 
 */
function sort(arr, func=identity) { // Sort arr using function in ascending order
    for (let i = 0; i < arr.length; i += 1) {
        let k = i;
        while (k > 0 && func(arr[k]) < func(arr[k-1])) {
            let store = arr[k];
            arr[k] = arr[k-1];
            arr[k-1] = store;
            k -= 1;
        }
    }
}

export {
    sort
}