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

    
}

export {
    tiles,
    NUM_TILES,
    handToString,
    Game
}
