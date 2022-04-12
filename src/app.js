const dotenv = require('dotenv')
dotenv.config();
const Client = require('./structures/Clients')
const client = new Client()
console.log("Starting Bot . . .")

client.start(process.env.BOT_TOKEN2)