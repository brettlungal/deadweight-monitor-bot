const Discord = require('discord.js');
require('dotenv').config();
const client = new Discord.Client();
const API = require('call-of-duty-api')();
const fs = require('fs');
const token = process.env.DISCORD_SECRET_TOKEN;
const username = process.env.ACTIVISION_USERNAME;
const pass = process.env.ACTIVISION_PASS;

function get_stats(gamertag,platform){
    var data_resp;
    API.login(username, pass).then((data) => {
        console.log(data); // see output
        API.MWcombatwz(gamertag,platform).then((data) => {
            data_resp = data;
            console.log(data.summary.all.kdRatio);
        })
      })
      .catch((err) => {
        console.log(err);
      });
      return data_resp
}

function get_gametag(discord_name){
    const data = new Array(2);
    switch( discord_name ){
        case "chef#7488":
            data[0] = "";
            data[1] = "psn"
            break;
        case "OnceAndForAll#0289":
            data[0] = "OnceAnd4All#11770";
            data[1] = "battle"
            break;
        case "Bergenator15#3395":
            data[0] = "";
            data[1] = "psn"
            break;
        case "schulzy33#1296":
            data[0] = "";
            data[1] = "psn"
            break;
        case "brogrammer39#8849":
            data[0] = "brogrammer39#1827";
            data[1] = "battle"
            break;
    }
    return data;
}

function processCommand(command,discord_name){
    if ( command == "stats" ){
        var data = get_gametag(discord_name);
        var stats = await get_stats(data[0],data[1]);
        var ms = 5000;
        setTimeout(function(){
            console.log(stats);
        },ms);
    }
}

client.on('ready' , () =>{
    console.log('This bot is online');
})


client.on('message', (msg) => {
    if ( msg.author == client.user ){
        return
    }

    console.log(msg.member.user.tag);

    if ( msg.content.charAt(0) == '!' ){
        var cmd = msg.content.toString().substring(1,msg.content.toString().length);
        processCommand(cmd,msg.member.user.tag);
    }

})

client.login(token);