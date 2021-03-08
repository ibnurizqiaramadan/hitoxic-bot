const {
    API_TOKEN,
    API_URL
} = require("../config.json")
const request = require('request')
const Function = require('../helper/Function')
const fun = new Function()
 
class Engine {
    async getGuildSettings() {
        return new Promise(callback => {
            request({
                method: 'POST',
                url: `${API_URL}guilds`,
                formData: {
                    'token': API_TOKEN
                }
            }, function (error, response) {
                if (error) throw error
                let data = fun.parseJSON(response.body)
                'ok' == data.status ? callback(data) : callback(response)
            });
        })
    }

    async getMembersStatus(guild = '') {
        return new Promise(callback => {
            request({
                method: 'POST',
                url: `${API_URL}members/${guild}`,
                formData: {
                    'token': API_TOKEN
                }
            }, function (error, response) {
                if (error) throw error
                let data = fun.parseJSON(response.body)
                'ok' == data.status ? callback(data) : callback(response)
            });
        })
    }

    async addMembers(message) {
        return new Promise(callback => {
            request({
                method: 'POST',
                url: `${API_URL}members/store`,
                formData: {
                    'token': API_TOKEN,
                    'id': message.author.id,
                    'username': message.author.tag
                }
            }, function (error, response) {
                if (error) throw error
                let data = fun.parseJSON(response.body)
                'ok' == data.status ? callback(data) : callback(response)
            });
        })
    }

    async addMembersGuild(message) {
        return new Promise(callback => {
            request({
                method: 'POST',
                url: `${API_URL}members/guild/store`,
                formData: {
                    'token': API_TOKEN,
                    'guild_id': message.guild.id,
                    'member_id': message.author.id
                }
            }, function (error, response) {
                if (error) throw error
                let data = fun.parseJSON(response.body)
                'ok' == data.status ? callback(data) : callback(response)
            });
        })
    }

    async addChannels(message) {
        return new Promise(callback => {
            request({
                method: 'POST',
                url: `${API_URL}channels/store`,
                formData: {
                    'token': API_TOKEN,
                    'id': message.channel.id,
                    'guild_id': message.guild.id,
                    'channel_name': message.channel.name
                }
            }, function (error, response) {
                if (error) throw error
                let data = fun.parseJSON(response.body)
                'ok' == data.status ? callback(data) : callback(response)
            });
        })
    }

    async addGuilds(message) {
        return new Promise(callback => {
            request({
                method: 'POST',
                url: `${API_URL}guilds/store`,
                formData: {
                    'token': API_TOKEN,
                    'id': message.guild.id,
                    'guild_name': message.guild.name,
                }
            }, function (error, response) {
                if (error) throw error
                let data = fun.parseJSON(response.body)
                'ok' == data.status ? callback(data) : callback(response)
            });
        })
    }

    async addChannelsGuild(message) {
        return new Promise(callback => {
            request({
                method: 'POST',
                url: `${API_URL}channels/guild/store`,
                formData: {
                    'token': API_TOKEN,
                    'guild_id': message.guild.id,
                    'channel_id': message.channel.id
                }
            }, function (error, response) {
                if (error) throw error
                let data = fun.parseJSON(response.body)
                'ok' == data.status ? callback(data) : callback(response)
            });
        })
    }

    async storeMessages(message, option = {}) {
        return new Promise(callback => {
            request({
                method: 'POST',
                url: `${API_URL}message/store`,
                formData: {
                    'token': API_TOKEN,
                    'message_id': message.id,
                    'guild_id': message.guild.id,
                    'channel_id': message.channel.id,
                    'user_id': message.author.id,
                    'username': message.author.tag,
                    'message': message.content,
                    'attachments': JSON.stringify(option.attachments) ?? '',
                    'type': option.type ?? '0' 
                }
            }, function (error, response) {
                if (error) throw error
                let data = fun.parseJSON(response.body)
                'ok' == data.status ? callback(data) : callback(response)
            });
        })
    }

    setMessage(message) {
        this.message = message.content
        const attachments = (message.attachments).array()
        const originalMessage = message.content
        let berkas = []
        attachments.forEach(attachment => {
            berkas.push(attachment.url)
        })
        this.attachments = berkas
        this.originalMessage = originalMessage
        return this
    }
    setMessageString(message) {
        return this.message = message, this
    }
    setLowerCase() {
        const tampungMessage = this.message
        this.message = tampungMessage.toLowerCase()
        return this
    }
    removeSpace() {
        const tampungMessage = this.message
        return this.message = tampungMessage.replace(/\ /g, ""), this
    }
    removeUrl() {
        const tampungMessage = this.message
        return this.message = tampungMessage.replace(/(?:https?|ftp):\/\/[\n\S]+/g, ""), this
    }
    removeMention() {
        const tampungMessage = this.message
        return this.message = tampungMessage.replace(/<@[\n\S]+>/g, ""), this
    }
    removeMentionChannel() {
        const tampungMessage = this.message
        return this.message = tampungMessage.replace(/<#[\n\S]+>/g, ""), this
    }
    removeEmoji() {
        const tampungMessage = this.message
        return this.message = tampungMessage.replace(/<:[\n\S]+:[\n\S]+>/g, ""), this
    }
    removeDuplicate() {
        const tampungMessage = this.message
        let res = ""
        let x = []
        for (let i = 0; i < tampungMessage.length; i++) {
            if (x[x.length - 1] != tampungMessage[i]) {
                x[i] = tampungMessage[i]
            }
        }
        x.forEach(zz => {
            res += zz
        })
        this.message = res
        return this
    }
    removeIgnore(ignoreData = []) {
        let tampungMessage = this.message
        ignoreData.forEach(kata => {
            tampungMessage = tampungMessage.replace(new RegExp(kata, "g"), "")
        })
        this.message = tampungMessage
        return this
    }
    checkBad(badData = []) {
        const tampungMessage = this.message
        let badMatch = []
        badData.forEach(bad => {
            if (tampungMessage.includes(bad.trim())) badMatch.push(bad)
        })
        this.bad = badMatch
        this.message = tampungMessage
        return this
    }
    result() {
        return this
    }
}
module.exports = Engine