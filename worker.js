import io from 'socket.io-client';
import querystring from 'querystring';


module.exports = (args) => {

    //TODO validate args --url
    //TODO validate args --secret

    let secret = args['secret'];

    let socket = io.connect(args['url'], { query: querystring.stringify({ secret: secret, platform: process.platform }) });

    socket.on('messages', (data) => {
        console.log('Message:', data);
    });

    //TODO decidir si esto es util. Se podría usar pm2 para forar el reinicio despues del disconnect.
    //Quizas el propio socket reconecta mejor solo que reiniciando.
    socket.on('disconnect', () => {
        console.log('Server gone');
        process.exit(1);
    })
}