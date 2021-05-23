
const Discord = require('discord.js');
require('dotenv').config();
const client = new Discord.Client();

const token = process.env.DISCORD_SECRET_TOKEN;


client.on('ready' , () =>{
    console.log('This bot is online');
})

client.login(token);