import {
    tiles,
    NUM_TILES,
    handToString,
    Game
} from './modules/game.js';

import { WebSocketServer } from 'ws';


const wss = new WebSocketServer ( {port: 8082} );

let playerCount = 0;
let players = [];
let game;
let turnPlayer = 0;

let websocket_connections = [];

/** 
 * Functions for queries
 */
function sendHand(ws_connection, player_id) {
    ws_connection.send('HAND:' + handToString(game.hands[player_id]));
}
function drawTile(ws_connection, player_id) {
    game.drawTile(player_id);
    ws_connection.send('HAND:' + handToString(game.hands[player_id]));
}
function dropTile(ws_connection, player_id, tile) {
    game.dropTile(player_id, tile);
    ws_connection.send('HAND:' + handToString(game.hands[player_id]));
}

wss.on('connection', ws => { //ws is a single connection

    websocket_connections.push(ws);

    ws.on('close', () => { // when the CONNECTION closes
        console.log('client has disconnected')
    });

    ws.on('message', data => {
        data = String(data);
        if (data.split(":")[0] == 'QUERY') { // queries are in the form QUERY:{query stuff};id;args
            let q = data.split(":")[1].split(';')[0] // q is the query
            let player_id = data.split(":")[1].split(';')[1] // player_id is the id
            console.log(`query received from ${player_id}: ${q}`);

            if (players.indexOf(player_id) != turnPlayer) { // If not the turn player, don't respect the query
                ws.send('It is not your turn yet!');
                return;
            }

            if (q == 'send hand') {
                sendHand(ws, player_id);
            } else if (q == 'draw tile') {
                drawTile(ws, player_id);
            } else if (q.slice(0, 9) == 'drop tile') {
                dropTile(ws, player_id, q.slice(10)); // Get just the tile
                turnPlayer = (turnPlayer + 1)%4; // Dropping tile ends a player's turn
            }
        } else {
            if (playerCount >= 4) {
                return;
            }
            players[playerCount] = data;
            playerCount += 1;
            ws.send(`You are player ${playerCount-1}!`);
            if (playerCount == 4) { // Only create the game when there are 4 players
                game = new Game(players[0], players[1], players[2], players[3]);
                for (let i = 0; i < 4; i += 1) {
                    let ws_connection = websocket_connections[i];
                    sendHand(ws_connection, players[i]);
                }
            } 
        }

        
    });
});
