import { sort } from './utils.js'

/**
 * Creates an empty hand table
 * - The hand table has four keys: 'b', 'c', 'd', 'honors'.
 * - For each key, there is an array of two elements. The first element is the total number
 *   of tiles of that suit/type. The second element is the dictionary of tiles of that suit/type.
 *   For each tile, there is an array of two elements. The first element is the freqency of that
 *   tile in the hand. The second element is the number of those tiles that are "locked" (placed).
 */
function emptyHandTable() {
    let ret = {};
    ret['b'] = [0, {
        '1':[0,0],
        '2':[0,0],
        '3':[0,0],
        '4':[0,0],
        '5':[0,0],
        '6':[0,0],
        '7':[0,0],
        '8':[0,0],
        '9':[0,0]
    }];
    ret['c'] = [0, {
        '1':[0,0],
        '2':[0,0],
        '3':[0,0],
        '4':[0,0],
        '5':[0,0],
        '6':[0,0],
        '7':[0,0],
        '8':[0,0],
        '9':[0,0]
    }];
    ret['d'] = [0, {
        '1':[0,0],
        '2':[0,0],
        '3':[0,0],
        '4':[0,0],
        '5':[0,0],
        '6':[0,0],
        '7':[0,0],
        '8':[0,0],
        '9':[0,0]
    }];
    ret['honor'] = [0, {
        'red':[0,0],
        'green':[0,0],
        'white':[0,0],
        'ew':[0,0],
        'sw':[0,0],
        'ww':[0,0],
        'nw':[0,0]
    }];
    return ret;
}

function getTileInfo(tile, handTable) {
    if (honors.has(tile)) {
        return handTable['honor'][1][tile];
    } else {
        let suit = tile[0];
        let number = tile[1];
        return handTable[suit][1][number];
    }
}

const honors = new Set(['red', 'green', 'white', 'ew', 'sw', 'ww', 'nw']);

class Player {
    constructor(playerId) {
        this.playerId = playerId;
        this.hand = []; // This is the hand that will be displayed. It will always be sorted.
        this.handTable = emptyHandTable(); // This is the hand that will actually be useful
    }

    drawTile(tile) {
        getTileInfo(tile, this.handTable)[0] += 1; // Add one to frequency
        if (honors.has(tile)) { // If the tile is an honor tile
            this.handTable['honor'][0] += 1; // Add 1 to the total number of honors
        } else { // Not an honor tile
            let suit = tile[0];
            this.handTable[suit][0] += 1; // Add 1 to the total number of that suit
        }

        this.hand.push(tile);
        sort(this.hand);
    }

    // Returns true when successful and false otherwise
    dropTile(tile) {
        let tileInfo = getTileInfo(tile, this.handTable);

        if (tileInfo[0] == 0) { // There are none of that tile
            return false;
        }
        if (tileInfo[0] == tileInfo[1]) { // All of that tile are placed down (none in hand)
            return false;
        }

        tileInfo[0] -= 1; // Remove one from frequency
        if (honors.has(tile)) { // If the tile is an honor tile
            this.handTable['honor'][0] -= 1; // Add 1 to the total number of honors
        } else { // Not an honor tile
            let suit = tile[0];
            this.handTable[suit][0] -= 1; // Add 1 to the total number of that suit
        }

        let index = this.hand.indexOf(tile);
        this.hand.splice(index, 1);   

        return true;
    }

    getBambooCount() {
        return this.handTable['b'][0];
    }
    getCharacterCount() {
        return this.handTable['c'][0];
    }
    getDotsCount() {
        return this.handTable['d'][0];
    }
    getHonorCount() {
        return this.handTable['honor'][0];
    }

    
}

export {
    Player
}
