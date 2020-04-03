const Discord = require('discord.js');
const { prefix_win, prefix_help, token, base_image } = require('./config.json');
const client = new Discord.Client();
const fs = require("fs");
const Jimp = require('jimp')
const path = require('path');

var icons = ["blue","green","grey","orange","purple","red","steel","teal","yellow"]

var icons_path = path.join(__dirname,'icons/',)

client.once('ready', () => {

    console.log('Ready!')

})

client.on('message', message => {

    if(message.content.startsWith(`${prefix_help}`)) {
        var help_info = new Discord.MessageEmbed()
          .setColor(message.member.displayHexColor)
          .attachFiles(path.join(__dirname,base_image))
	        .setTitle('How to Use BirdBot')
	        .setAuthor('BirdBot', 'attachment://kiwi_base.png', 'https://discord.js.org')
	        .setDescription('Using BirdBot is easy')
        	.setThumbnail('attachment://kiwi_base.png')

        	.addFields(
        		{ name: 'Command', value: 'Function' },
                { name: '!help', value: 'Brings up this help message' },
                { name: '!win', value: 'Changes the icon to your colour' },
                { name: '!win [blue, green, grey, orange, purple, red, steel, teal, yellow]', value: 'Changes the icon to the selected colour' },

        	)
        	.setTimestamp()
        	.setFooter('hope that helped', 'attachment://kiwi_base.png');

        message.channel.send(help_info)
    }

    if(message.content.startsWith(`${prefix_win}`)) {

        var str = message.content
        var str_colour = ""
        var str_title = ""
        var str_win_message = ""

        str = str.split(" ")

        if(str[0] == prefix_win && str.length == 2){

            console.log("Win message includes colour " + str[1])

            str_colour = str[1].toLowerCase()
            str_title = str_colour.charAt(0).toUpperCase() + str_colour.slice(1)

            console.log(str_colour)

            if (n = icons.includes(str_colour)) {

                change_icon(message,str_colour)

                str_win_message = str_title + " is the reigning champion! Caw Caw!"

            } else {
                str_win_message = "Colour not found"
            }
        } else if(str[0] == prefix_win && str.length == 1) {

            console.log("Win message does not colour")

            str_colour = message.member.displayHexColor
            str_win_message = message.member.displayName + " is the reigning champion! Caw Caw!"

            check_icon_exists(message,function(result) {
                if(result == 'false') {
                    console.log("new icon created " + message.member.displayHexColor)
                    create_icon(message)
                } else {
                    change_icon(message,str_colour)
                }
            });

        } else {
            str_win_message = "error"
        }

        message.channel.send(str_win_message)
    }



})

function change_icon(message,file){

        message.guild.setIcon(fs.readFileSync(path.join(__dirname,'icons',file + '.jpg')))
        .then(updated => console.log('Updated the server icon ' + file))
        .catch(console.error)

}

function create_icon(message) {

    background_colour = Jimp.cssColorToHex(message.member.displayHexColor)

    Jimp.read(path.join(__dirname,base_image), (err, image) => {
        if (err) reject(err);
        image
            .background(background_colour) // set background alpha colour
            .write(path.join(__dirname,'icons', message.member.displayHexColor + '.jpg'),callback); // save
    });

    function callback() {
        change_icon(message,message.member.displayHexColor)
    }
}

function check_icon_exists(message,callback) {
    //console.log('Checking for icons in ' + icons_path)
    fs.readdir(icons_path, function (err, files) {
        if (err) {
            console.log(err);
            return;
        }

        files_length = files.length
        //console.log(files)

        var all_names = []
        var all_types = []

        for (var i = 0; i < files.length; i++) {

            var arr_temp = files[i].split(".");  // just split once
            all_names.push(arr_temp[0]); // before the dot
            all_types.push(arr_temp[1]); // after the dot

            //console.log(all_names)
        }

        if (all_names.includes(message.member.displayHexColor)) {

            //console.log('icon exists')
            callback('true')
        } else {
            //console.log('icon does not exists')
            callback('false')
        }
    });
}

client.login(token);
