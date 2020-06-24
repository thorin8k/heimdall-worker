import io from 'socket.io-client';
import querystring from 'querystring';

import JobRunner from './job_runner';

module.exports = (args) => {

    //TODO validate args --url
    //TODO validate args --secret

    let secret = args['secret'];

    let socket = io.connect(args['url'], { query: querystring.stringify({ secret: secret, platform: process.platform }) });

    socket.on('messages', (data) => {
        console.log('Message:', data);
    });

    socket.on('run_job', (data) => {
        try {
            JobRunner(data, socket);
        } catch (e) {
            socket.emit('job_' + data.id, {
                type: 'error',
                message: e
            });
        }
    })
    //TODO decidir si esto es util. Se podría usar pm2 para forar el reinicio despues del disconnect.
    //Quizas el propio socket reconecta mejor solo que reiniciando.
    socket.on('disconnect', () => {
        console.log('Server gone');
        // console.log("Restarting");
        // setTimeout(function () {
        //     process.on("exit", function () {
        //         require("child_process").spawn(process.argv.shift(), process.argv, {
        //             cwd: process.cwd(),
        //             detached: true,
        //             stdio: "inherit"
        //         });
        //     });
        //     process.exit();
        // }, 5000);
    })
}