import EventEmitter from 'events';

class MyEmitter extends EventEmitter{}

 const myEmitter = new MyEmitter();

 myEmitter.on('WaterFull', () => {
    console.log('Please turn off the motor!');
    setTimeout(() => {
        console.log('Please trun off the motor and get a notificae reminder');
        
    }, 3000);
    
 })

 console.log("motor is running");
 myEmitter.emit('WaterFull');