import io from 'socket.io-client';
import querystring from 'querystring';


module.exports = (args) => {

    //TODO validate args --url
    //TODO validate args --secret

    let secret = args['secret'];

    let socket = io.connect(args['url'], { query: querystring.stringify({ secret: secret }) });

    socket.on('messages', function (data) {
        console.log('Got announcement:', data);
    });
}