import { exec, mkdir, test } from 'shelljs';

const runScript = async (job, command, socket) => {

}


const runExecutable = (job, command, socket) => {
    return new Promise((resolve, reject) => {


        socket.emit('job_' + job.id, {
            type: 'log',
            message: "Start Working on '" + command.name + "'"
        });

        const child = exec(command.params.command, { silent: true, async: true });
        child.stdout.on('data', (data) => {
            socket.emit('job_' + job.id, {
                type: 'log',
                message: data.toString()
            })
        });
        child.stderr.on('data', (data) => {
            socket.emit('job_' + job.id, {
                type: 'error',
                message: data.toString()
            })
        });

        child.on('close', (code) => {
            if (code === 0) {
                //TODO check code and launch reject
                return resolve();
            }
            return reject();
        })
    });

}



export default async (job, socket) => {

    socket.emit('job_' + job.id, {
        type: 'log',
        message: "Start Working on " + job.name
    });

    if (!test('-e', './work/' + job.id)) {
        mkdir('-p', './work/' + job.id);
    }

    for (const command of job.commands_info) {
        switch (command.type) {
            case 'script':
                await runScript(job, command, socket);
                break;
            case 'executable':
                await runExecutable(job, command, socket);
                break;

        }
    }


}