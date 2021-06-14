const Discord = require('discord.js');
require('dotenv').config();
const client = new Discord.Client();
const API = require('call-of-duty-api')();
const fs = require('fs');
const token = process.env.DISCORD_SECRET_TOKEN;
const username = process.env.ACTIVISION_USERNAME;
const pass = process.env.ACTIVISION_PASS;
var curr_msg;



function get_match_stats(gamertag, platform) {
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

  function get_alltime_stats(gamertag, platform) {
    return new Promise((resolve, reject) => {
      API.login(username, pass).then((data) => {
        console.log(data);
        API.MWwz(gamertag, platform).then((stats_data) => {
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
            data[0] = "schulzy33";
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
    if ( command == "match" ){
        var data = get_gametag(discord_name);
        var stats = get_match_stats(data[0],data[1]).then((stats_data) => {
            var match = stats_data.matches[0].playerStats;
            let kills = match.kills;
            let deaths = match.deaths;
            let damage_done = match.damageDone;
            let damage_taken = match.damageTaken;
            let place = match.teamPlacement;

            if ( place == "1" ){
                teamPlacement = "1st";
            }else if ( place == "2" ){
                teamPlacement = "2nd";
            }else if( place == "3" ){
                teamPlacement = "3rd";
            }else{
                teamPlacement = place+"th";
            }

            curr_msg.channel.send("```Stats for "+data[0]+"'s last match\n=========================\n\nKills: "+kills+"\nDeaths: "+deaths+"\nDamage Done: "+damage_done+"\nDamage Taken: "+damage_taken+"\nTeam Placement: "+teamPlacement+"```");
        }).catch((err) => {
            console.log(err)
        });
    }
    if ( command == "stats" ){
        var data = get_gametag(discord_name);
        get_alltime_stats(data[0],data[1]).then((stats_data) => {
            

            //curr_msg.channel.send("```Stats for "+data[0]+"'s last match\n=========================\n\nKills: "+kills+"\nDeaths: "+deaths+"\nDamage Done: "+damage_done+"\nDamage Taken: "+damage_taken+"\nTeam Placement: "+teamPlacement+"```");
        }).catch((err) => {
            console.log(err)
        });
    }
}

function meme_on_og(content){
    let reply = "";
    let count = 0;
    for ( var i=0; i<content.length; i++ ){
        if ( count % 2 == 0 ){
            reply+=content.charAt(i).toUpperCase();
        }else{
            reply+=content.charAt(i);
        }
        if ( content.charAt(i) != " " ){
            count+=1;
        }

    }
    return reply;
}

client.on('ready' , () =>{
    console.log('This bot is online');
})


client.on('message', (msg) => {
    if ( msg.author == client.user ){
        return
    }
    
    if ( msg.author.username == "chef"){
        let content = msg.content.toString();
        if ( content.includes("pls") || content.includes("Pls") ){
            return
        }
        reply = meme_on_og(content)
        msg.channel.send(reply)
    }

    curr_msg = msg;
    console.log(msg.member.user.tag);

    if ( msg.content.charAt(0) == '!' ){
        var cmd = msg.content.toString().substring(1,msg.content.toString().length);
        processCommand(cmd,msg.member.user.tag);
    }

})

client.login(token);