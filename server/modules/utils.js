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

/* Randomize array in-place using Durstenfeld shuffle algorithm */
// SOURCE: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

export {
    sort,
    shuffleArray
}