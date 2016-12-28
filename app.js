var Gpio = require('onoff').Gpio;
var sh = require('shelljs');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
// Configure GPIO pin 21 for input and rising edge detection
var pir = new Gpio(21, 'in', 'rising');
var sgOptions = {
    auth: {
        api_user: 'iot@nprail.me',
        api_key: 'eR1s2I9q2lAN'
    }
}
var mailer = nodemailer.createTransport(sgTransport(sgOptions));

// Verify Email Settings
mailer.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
});
var email = {
    to: 'noah@prail.net',
    from: 'iot@nprail.me',
    subject: 'Prail.Net IoT Message: Motion Detected',
    text: 'Motion has been detected on RPiS1.'
};

// Add the edge detection callback to catch the motion detection events
pir.watch(function (err, value) {
    if (value === 1) {
        // The pin went high
        sh.exec('bash screenOn.sh', function (code, stdout, stderr) {
            console.log('Exit code:', code);
            console.log('Program output:', stdout);
            console.log('Program stderr:', stderr);
        });
        mailer.sendMail(email, function (err, res) {
            if (err) {
                console.log(err)
            }
            console.log(res);
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
