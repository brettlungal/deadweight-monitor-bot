const Discord = require('discord.js');
require('dotenv').config();
const client = new Discord.Client();
const API = require('call-of-duty-api')();
const fs = require('fs');
const token = process.env.DISCORD_SECRET_TOKEN;
const username = process.env.ACTIVISION_USERNAME;
const pass = process.env.ACTIVISION_PASS;
var curr_msg;
function get_stats(gamertag, platform) {
    return new Promise((resolve, reject) => {
      API.login(username, pass).then((data) => {
        console.log(data);
        API.MWcombatwz(gamertag, platform).then((stats_data) => {
          //console.log(data.summary.all.kdRatio);
          resolve(stats_data);
        }).catch((stats_err) => {
            console.log(err);
            reject(stats_err);
        })
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      })
    })
  }

function get_gametag(discord_name){
    const data = new Array(2);
    switch( discord_name ){
        case "chef#7488":
            data[0] = "BrowneyStinson_2#7683957";
            data[1] = "acti"
            break;
        case "OnceAndForAll#0289":
            data[0] = "OnceAnd4All#11770";
            data[1] = "battle"
            break;
        case "Bergenator15#3395":
            data[0] = "Bergenator15";
            data[1] = "acti"
            break;
        case "schulzy33#1296":
            data[0] = "chulzy33";
            data[1] = "acti"
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
        var stats = get_stats(data[0],data[1]).then((stats_data) => {
            console.log(stats_data.summary.all.kdRatio);
            console.log(data[0]);
            curr_msg.channel.send(data[0]+" has a KD of "+stats_data.summary.all.kdRatio+" in the last 20 matches");
        }).catch((err) => {
            console.log(err)
        });
    }
}

client.on('ready' , () =>{
    console.log('This bot is online');
})


client.on('message', (msg) => {
    if ( msg.author == client.user ){
        return
    }
    curr_msg = msg;
    console.log(msg.member.user.tag);

    if ( msg.content.charAt(0) == '!' ){
        var cmd = msg.content.toString().substring(1,msg.content.toString().length);
        processCommand(cmd,msg.member.user.tag);
    }

})

client.login(token);