import { sort } from './utils.js'

/**
 * Creates an empty hand table
 * - The hand table has four keys: 'b', 'c', 'd', 'honors'.
 * - Each key has an array. The first element is the number of total tiles of that type.
 *   The rest of the array store the frequencies for each of the tiles.
 * - ret['b'][1] gives the number of b1 tiles
 */
 function emptyHandTable() {
    let ret = {};
    ret['b'] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    ret['c'] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    ret['d'] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    ret['honor'] = [0, 0, 0, 0, 0, 0, 0, 0];// mappings -- red:1, green:2, white:3, ew:4, sw:5, ww:6, nw:7
    return ret;
}

function emptyLockedTable() {
    let ret = {};
    ret['b'] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    ret['c'] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    ret['d'] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    ret['honor'] = [0, 0, 0, 0, 0, 0, 0, 0];// mappings -- red:1, green:2, white:3, ew:4, sw:5, ww:6, nw:7
    return ret;
}

const honors = new Set(['red', 'green', 'white', 'ew', 'sw', 'ww', 'nw']);
const honorsMappings = {'red':1, 'green':2, 'white':3, 'ew':4, 'sw':5, 'ww':6, 'nw':7}

class Player {
    constructor(playerId) {
        this.playerId = playerId;
        this.hand = []; // This is the hand that will be displayed. It will always be sorted.
        this.handTable = emptyHandTable(); // This is the hand that will actually be useful
        this.lockedTable = emptyLockedTable(); 
        this.allConcealed = true;
    }

    drawTile(tile) {
        if (honors.has(tile)) { // If the tile is an honor tile
            this.handTable['honor'][0] += 1; // Add 1 to the total number of honors
            this.handTable['honor'][honorsMappings[tile]] += 1;
        } else { // Not an honor tile
            let suit = tile[0];
            let number = parseInt(tile[1]);
            this.handTable[suit][0] += 1; // Add 1 to the total number of that suit
            this.handTable[suit][number] += 1; // Add 1 to the total number of that suit
        }

        this.hand.push(tile);
        sort(this.hand);
    }

    // Returns true when successful and false otherwise
    dropTile(tile) {
        if (honors.has(tile)) { // If the tile is an honor tile
            if (this.handTable['honor'][honorsMappings[tile]] == 0) {
                return false;
            }
            if (this.handTable['honor'][honorsMappings[tile]] == this.lockedTable['honor'][honorsMappings[tile]]) {
                return false;
            }
            this.handTable['honor'][0] -= 1;
            this.handTable['honor'][honorsMappings[tile]] -= 1;
        } else { // Not an honor tile
            let suit = tile[0];
            let number = parseInt(tile[1]);
            if (!(number <= 9 && number >= 1)) { // invalid number
                return false;
            }
            if (this.handTable[suit][number] == 0) {
                return false;
            }
            if (this.handTable[suit][number] == this.lockedTable[suit][number]) {
                return false;
            }
            this.handTable[suit][0] -= 1;
            this.handTable[suit][number] -= 1;
        }

        let index = this.hand.indexOf(tile);
        this.hand.splice(index, 1);   

        return true;
    }

    /**
     * Getters for the handTable
     */
    getBambooArray() {
        return this.handTable['b'];
    }
    getCharactersArray() {
        return this.handTable['c'];
    }
    getDotsArray() {
        return this.handTable['d'];
    }
    getHonorsArray() {
        return this.handTable['honor'];
    }
}

export {
    Player
}
