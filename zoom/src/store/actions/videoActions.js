import IO from 'socket.io-client';
import Peer from 'react-native-peerjs';

import { MY_STREAM, ADD_STREAM } from './types';

//*API URL*/
export const API_URI = 'http://192.168.16.119:5000';

//*Socket Config */
export const socket = IO(`${API_URI}`, {
  forceNew: true,
});

//* Peer Config*/
const peerServer = new Peer(undefined, {
  host: '192.168.16.119',
  secure: false,
  port: 5000,
  path: '/mypeer',
});

socket.on('connection', () => console.log('Connected client'));

export const jointRoom = (stream) => async (dispatch) => {
  const roomID = 'a1b2';

  //set my own stream
  dispatch({ type: MY_STREAM, payload: stream });
  //open connection
  peerServer.on('open', (userId) => {
    socket.emit('join-room', { userId, roomID });
  });

  socket.on('user-connected', (userId) => {
    connectToNewUser(userId, stream, dispatch);
  });

  // receive the call
  peerServer.on('call', (call) => {
    call.answer(stream);

    // strean back the call
    call.on('stream', (stream) => {
      dispatch({ type: ADD_STREAM, payload: stream });
    });
  });
};

function connectToNewUser(userId, stream, dispatch) {
  const call = peerServer.call(userId, stream);
}
