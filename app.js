var Gpio = require('onoff').Gpio;
var sh = require('shelljs');
var nodemailer = require('nodemailer');
// Configure GPIO pin 21 for input and rising edge detection
var pir = new Gpio(21, 'in', 'rising');
var smtpConfig = {
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: true, // use SSL
    auth: {
        user: 'IoT@NPrail.me',
        pass: 'eR1s2I9q2lAN'
    }
};
var transporter = nodemailer.createTransport(options[smtpConfig]);

// Verify Email Settings
transporter.verify(function(error, success) {
   if (error) {
        console.log(error);
   } else {
        console.log('Server is ready to take our messages');
   }
});

// Add the edge detection callback to catch the motion detection events
pir.watch(function (err, value) {
    if (value === 1) {
        // The pin went high
        sh.exec('bash screenOn.sh', function (code, stdout, stderr) {
            console.log('Exit code:', code);
            console.log('Program output:', stdout);
            console.log('Program stderr:', stderr);
        });
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
