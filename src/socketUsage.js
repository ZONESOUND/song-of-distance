import io from 'socket.io-client';
import {serverIP} from './config';

const socket = io(serverIP);
let isSocketConnect = false;
socket.on('connect', () => {
    isSocketConnect = true;
    console.log('socket connect to server');
})

export let emitOSC = (address, value)=> {
    socket.emit('osc', {
        address: address,
        args: [{
            value: value
        }]
    });
}

export let receiveOSC = (func) => {
    socket.on('osc', func);
}

export {isSocketConnect};