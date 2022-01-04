import { shuffleArray } from './utils.js'
import { Player } from './player.js'

// d: dots, b: bamboo, c: character
const tiles = new Set(['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 
                'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9',
                'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9',
                'ew', 'sw', 'ww', 'nw',
                'red', 'green', 'white']);
const NUM_TILES = 136;

function handToString(hand) {
    let retString = "";
    for (let i = 0; i < hand.length; i += 1) {
        retString += `${hand[i]} `
    }
    return retString.slice(0, retString.length-1);
}

/**
 * Checks if the hand is the Nine Gates. b, c, d, and h are arrays of tiles, with the first element
 * of each array being the sum of the other array elements.
 * @param {String[]} b 
 * @param {String[]} c 
 * @param {String[]} d 
 * @param {String[]} h 
 */
function checkNineGates(b, c, d, h) {
    return (c[1] == 3 && c[2] == 1 && c[3] == 1 && c[4] == 1 && c[5] == 1 && c[6] == 1 
                && c[7] == 1 && c[8] == 1 && c[9] == 9);
}
function checkOrphans(b, c, d, h) {
    let arr = null;
    if ((b[0]-2)%3 == 0) { // eyes are in here or no eyes at all
        arr = b;
    } else if ((c[0]-2)%3 == 0) {
        arr = c;
    } else if ((d[0]-2)%3 == 0) {
        arr = d;
    } else {
        arr = h;
    }
    let found = false;
    for (let i = 1; i < 10; i += 1) {
        if (arr[i] == 2) {
            found = true;
            break;
        }
    }
    if (!found) { // If unable to find the eyes
        return false;
    }
    
    let u = b[1] == 3;
    let v = b[9] == 3;
    let w = c[1] == 3;
    let x = c[9] == 3;
    let y = d[1] == 3;
    let z = d[9] == 3;
    return u + v + w + x + y + z == 4; // four pongs of those types
}

function checkTriplets(b, c, d, h) {
    let numPong = 0;
    for (let i=1; i < 10; i+=1) {
        numPong += Math.floor(b[i]/3) + Math.floor(c[i]/3) + Math.floor(d[i]/3); // Works for kong too!
    }
    for (let i=1; i<honors.length; i+=1) {
        numPong += Math.floor(h[i]);
    }
    return numPong == 4; // All pongs
}

function checkGreatWinds(b, c, d, h) {
    let w = h[4] == 3;
    let x = h[5] == 3;
    let y = h[6] == 3;
    let z = h[7] == 3;
    return w + x + y + z == 4; // four pongs of those types
}

function checkSmallWinds16(b, c, d, h) { 
    /**
     * First check the eyes are winds
     */
    let ewCount = h[4];
    let swCount = h[5];
    let wwCount = h[6];
    let nwCount = h[7];
    if ((ewCount==2) + (swCount==2) + (wwCount==2) + (nwCount==2) != 1) { // Only one pair of eyes and they must be a wind
        return false;
    }

    let e = ewCount == 3;
    let s = swCount == 3;
    let w = wwCount == 3;
    let n = nwCount == 3;

    return (e + s + w + n >= 3) && (h[1] == 3 || h[2] == 3 || h[3] == 3); // Three winds, one honor pong
}

function checkSmallWinds9(b, c, d, h) { 
    // Things to check: wind eyes, three wind melds, one suit
    /**
     * First check the eyes are winds
     */
    let ewCount = h[4];
    let swCount = h[5];
    let wwCount = h[6];
    let nwCount = h[7];
    if ((ewCount==2) + (swCount==2) + (wwCount==2) + (nwCount==2) != 1) { // Only one pair of eyes and they must be a wind
        return false;
    }

    let e = ewCount == 3;
    let s = swCount == 3;
    let w = wwCount == 3;
    let n = nwCount == 3;
    if (e + s + w + n < 3){ // Three wind melds
        return false;
    }

    if ((b[0] == 0) + (c[0] == 0) + (d[0] == 0) != 1) { // One suit
        return false;
    }
    let arr = null;
    if (b[0]>0) { // the meld must be in here
        arr = b;
    } else if (c[0]>0) {
        arr = c;
    } else{
        arr = d;
    }
    for (let i = 1; i <= 7; i += 1) {
        if (arr[i] == 3 || (arr[i]==1 && arr[i+1] == 1 && arr[i+2])) { // There is a pong or a straight
            return true;
        }
    }

    return false; // Did not find it :(
}

function checkGreatDragons(b, c, d, h) { 
    // Things to check: Three dragon melds, one meld, one pair of eyes 
    if (!(h[1] == 3 && h[2] == 3 && h[3] == 3)) { // Check three dragon melds
        return false;
    }
    
}

class Game {
    // p0,...,p3 are ids
    constructor(p0, p1, p2, p3) {
        // populate the deck
        this.discard = []
        this.lastDiscarded = null;
        this.deck = []
        tiles.forEach((tile)=>{
            this.deck.push(tile);
            this.deck.push(tile);
            this.deck.push(tile);
            this.deck.push(tile);
        })
        shuffleArray(this.deck);

        // populate the hands
        this.players = [new Player(p0), new Player(p1), new Player(p2), new Player(p3)];
        this.playerIds = [p0, p1, p2, p3];
        for (let i = 0; i < 4; i += 1) {
            for (let k = 0; k < 13; k += 1) { // Draw 13 tiles
                this.players[i%4].drawTile(this.deck[0]);
                this.deck = this.deck.slice(1);
            }
        }
    }

    /** Draw the top tile */
    drawTile(playerId) {
        let index = this.playerIds.indexOf(playerId);
        this.players[index].drawTile(this.deck[0]);
        this.deck = this.deck.slice(1);
    }

    /** Drop the selected tile */
    dropTile(playerId, tile) {
        let index = this.playerIds.indexOf(playerId);
        if (this.players[index].dropTile(tile)) {
            this.discard.push(this.lastDiscarded);
            this.lastDiscarded = tile;
            return true;
        }
        return false;
    }  

    getHand(playerId) {
        let index = this.playerIds.indexOf(playerId);
        return handToString(this.players[index].hand);
    }

    checkWin(playerId) {
        let player = players[playerIds.indexOf(playerId)] // Get the correct player
        if (player.allConcealed ) {

        }


        /**
         * First, check if a win is even possible.
         */
        let b = player.getBambooArray();
        let c = player.getCharactersArray();
        let d = player.getDotsArray();
        let h = player.getHonorsArray();
        if (!((((b-2)%3 == 0) 
                + ((c-2)%3 == 0) 
                + ((d-2)%3 == 0) 
                + ((h-2)%3 == 0)) == 1)) { // More than one set of eyes or no eyes at all
            return false;
        }
        if (!((b%3 == 0) + (b%3 == 0) + (b%3 == 0) == 3)) { // Must have three sets
            return false;
        }
    }
}

export {
    tiles,
    NUM_TILES,
    handToString,
    Game
}
