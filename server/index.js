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

let websocket_connections = [];

wss.on('connection', ws => { //ws is a single connection

    websocket_connections.push(ws);

    ws.on('close', () => { // when the CONNECTION closes
        console.log('client has disconnected')
    });

    ws.on('message', data => {
        data = String(data);
        if (data.split(":")[0] == 'QUERY') {
            console.log(data.split(":")[1])
        } else {
            if (playerCount >= 4) {
                return;
            }
            players[playerCount] = data;
            playerCount += 1;
            ws.send(`You are player ${playerCount-1}!`)
            if (playerCount == 4) { // Only create the game when there are 4 players
                let g = new Game(players[0], players[1], players[2], players[3]);
                for (let i = 0; i < 4; i += 1) {
                    let ws_connection = websocket_connections[i];
                    ws_connection.send('HAND:' + handToString(g.hands[g.players[i]]));
                }
            } 
        }

        
    });
});
