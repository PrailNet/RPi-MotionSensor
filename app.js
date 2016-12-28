var Gpio = require('onoff').Gpio;
var sh = require('shelljs');
// Configure GPIO pin 21 for input and rising edge detection
var pir = new Gpio(21, 'in', 'rising');

// Add the edge detection callback to catch the motion detection events
pir.watch(function (err, value) {
    console.log(value);
    if (value === 1) {
        // The pin went high
        /*sh.exec('bash screenOn.sh', function (code, stdout, stderr) {
            console.log('Exit code:', code);
            console.log('Program output:', stdout);
            console.log('Program stderr:', stderr);
        });*/
        console.log("Motion Detected: %d", value);
    }
});


function exit() {
    console.log("Exiting");
    pir.unexport();
    process.exit();
}

process.on('SIGINT', exit);

console.log("Monitoring...");
