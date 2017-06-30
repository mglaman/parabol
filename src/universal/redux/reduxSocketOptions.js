import {cashay, Transport} from 'cashay';
import socketCluster from 'socketcluster-client';
import subscriber from 'universal/subscriptions/subscriber';
import AuthEngine from './AuthEngine';
import {relayWS} from 'client/relayFetchQuery';
import relayEnv from 'client/relayEnv';

const onConnect = (options, hocOptions, socket) => {
  if (!cashay.priorityTransport) {
    const sendToServer = (request) => {
      return new Promise((resolve) => {
        socket.emit('graphql', request, (error, response) => {
          resolve(response);
        });
      });
    };
    const priorityTransport = new Transport(sendToServer);
    cashay.create({priorityTransport, subscriber});
    relayEnv.setWS(relayWS(socket));
  }
};

const onDisconnect = () => {
  cashay.create({priorityTransport: null});
  relayEnv.clear('wsEnv');
};
export default ({AuthEngine, socketCluster, onConnect, onDisconnect, keepAlive: 3000});
