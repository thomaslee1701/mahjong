// d: dots, b: bamboo, c: character
const tiles = new Set(['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 
                'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9',
                'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9',
                'ew', 'sw', 'ww', 'nw',
                'red', 'green', 'white']);
const NUM_TILES = 136;

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
        this.players = [p0, p1, p2, p3];
        this.hands = {};
        this.handsTable = {};
        for (let i = 0; i < 4; i += 1) {
            this.hands[this.players[i%4]] = this.deck.slice(0, 13); // Draw 13 tiles
            this.handsTable[this.players[i%4]] = 
            this.deck = this.deck.slice(13);
        }

    }

    /** Draw the top tile */
    drawTile(player_id) {
        this.hands[player_id].push(this.deck[0]);
        this.deck = this.deck.slice(1);
    }

    /** Drop the selected tile */
    dropTile(player_id, tile) {
        let hand = this.hands[player_id]
        let index = hand.indexOf(tile);
        if (index > -1) {
            this.discard.push(this.lastDiscarded);
            this.lastDiscarded = hand[index];
            hand.splice(index, 1);
            
        }
    }



    
}

export {
    tiles,
    NUM_TILES,
    handToString,
    Game
}
