import logEvent from "./logEvent.mjs";

import EventEmitter from 'events';

// initialize a object; 
class MyEmitter extends EventEmitter{};
 
const myEmitter = new MyEmitter();

//add a lister for a log event;

myEmitter.on('log', (msg)=>logEvent(msg));

setTimeout(()=>{
    myEmitter.emit('log', 'log Event Emitted')
}, 2000)