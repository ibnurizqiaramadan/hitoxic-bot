const { Client } = require('discord.js');

module.exports = class extends Client {
    constructor() {
        super()
        this.guildsData = new Map()
        this.membersData = new Map()
    }
}