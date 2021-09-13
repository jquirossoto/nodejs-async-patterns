
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
    console.log('Starting main thread');
    const worker = new Worker(__filename, {
        workerData: {
            outputPrefix: 'Received message',
            timeToWaste: 500
        }
    });
    //worker.on to listen event to get message from secondary thread
    worker.on('message', (msg) => {
        console.log(`Child: ${msg}`);
    });
    //worker.postMessage to send message to secondary thread
    worker.postMessage('Done with work in main thread');
    console.log('Still in main thread');
} else {
    //parentPor.on to listen event to get message from main thread
    parentPort.on('message', (msg) => {
        console.log(`Parent: (${workerData.outputPrefix}) ${msg}`);
    });
    //parentPort.postMessage to send message to main thread.
    parentPort.postMessage('Getting started wasting time.')
    wasteTime(workerData.timeToWaste);
    parentPort.postMessage('Between wasting time');
    wasteTime(workerData.timeToWaste);
    parentPort.postMessage('All done');
}


function wasteTime(delay) {
    const end = Date.now() + delay;
    while (Date.now() < end) { }
}