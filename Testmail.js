const sendEmail = require("./MailServ");

const recipient = process.argv[2];

async function test() {

if (!recipient) {
console.error("Usage: node Testmail.js recipient@example.com");
process.exitCode = 1;
return;
}

await sendEmail(

recipient,

"Test Email",

"<h1>Hello World</h1>"

);


console.log("Email sent");

}


test();