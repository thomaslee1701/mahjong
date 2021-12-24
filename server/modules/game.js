// d: dots, b: bamboo, c: character
const tiles = new Set(['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 
                'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9',
                'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9',
                'we', 'ws', 'ww', 'wn',
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
        this.hands[p0] = [];
        this.hands[p1] = [];
        this.hands[p2] = [];
        this.hands[p3] = [];

        for (let i = 0; i < 4*12; i += 1) {
            let index = Math.floor(Math.random() * this.deck.length);
            let toAdd = this.deck[index]; // Grab element from the deck
            this.deck.splice(index, 1);
            this.hands[this.players[i%4]].push(toAdd);
        }

    }
}

export {
    tiles,
    NUM_TILES,
    handToString,
    Game
}
