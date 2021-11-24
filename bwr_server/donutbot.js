const Discord = require('discord.js');
const bot = new Discord.Client();
const client = new Discord.Client();

const TOKEN = process.env.TOKEN;

bot.login(TOKEN);

bot.on('ready', () => {
	console.info(`Logged in as ${bot.user.tag}!`);
	bot.channels.cache.get('856134736392486923').send('Hello here from BWR! [donuts]')
});
var io = require("socket.io-client")
var socket = io("http://donut.bonkeyword.tk:80/");
						 
			socket.emit('login',{name:'BonziWORLD Revived Bot (s!)'})
			socket.on('reconnected',reconnected)
			 
			var reconnected = function(){
				var socket = io("http://localhost:80")
				socket.emit('login',{name:'BonziWORLLD Revived Bot (s!)'})
				socket.on('talk',function(data){
					var text = data.text
					if(text.startsWith('s!')){
						text = text.slice(2)
						var cmd = text.split(' ')[0]
						var oth = text.slice(cmd.length+1)
						if(Object.keys(commands).includes(cmd)){
							var command = commands[cmd](oth)
							setTimeout(function(){
								socket.emit('talk',{text:command})
							},100)
						}
					}
				})
				socket.on('reconnected',reconnected)
			}
			var cool = false; 
			var botsockets = []
			var commands = {
				help:function(){
					return "<h2>s!help</h2><h3>Commands:</h3>s!help, s!echo [text], s!join [user], s!burn, s!drunk [text], s!clickbait [text]"
				},
				echo(txt){
					if(txt.startsWith('s!')){
						return 'hahahaha nice joke lmao hahaha fuck you'
					}
					return txt
				},
				join(txt){
					if(cool){
						return "On cooldown!"
					}else{
						if(sockets.length > 10) return "Too much users."
						var botsock = io("http://localhost:80")
						botsock.emit('login',{name:txt,room:'default'})
						botsockets.push(botsock)
						cool = true
						setTimeout(function(){
							cool = false
						},5000)
					}
				},
				burn(){
					if(botsockets.length==0){
						return 'i have nothing to burn'
					}
					botsockets.map(n=>{
						n.disconnect()
					})
					sockets = []
				},
				drunk(txt){
					if(txt.startsWith('s!')){
						 return 'hahahaha nice joke lmao hahaha fuck you'.split('').map(n=>{
							if(Math.random()>0.5) return n.toUpperCase()
							return n
						}).join('')
					}
					return txt.toLowerCase().split('').map(n=>{
						if(Math.random()>0.5) return n.toUpperCase()
						return n
					}).join('')
				},
				mock(txt){
					if(txt.startsWith('s!')){
						 return 'hahahaha nice joke lmao hahaha fuck you'.split('').map(n=>{
							if(Math.random()>0.5) return n.toUpperCase()
							return n
						}).join('')
					}
					return txt.toLowerCase().split('').map(n=>{
						if(Math.random()>0.5) return n.toUpperCase()
						return n
					}).join('')
				},
				clickbait(txt){
					return (["omg!",':O','what?','wtf?!'][Math.floor(Math.random()*4)]+' '+txt+' '+["(gone wrong)",'(gone sexual)','(not clickbait!)','(cops called)'][Math.floor(Math.random()*4)]+'\u{1F631}'.repeat(Math.ceil(Math.random()*5))).toUpperCase()
				} 
			}
			socket.on('talk',function(data){
				var text = data.text
				
				if (data.name != "BonziWORLD Revived Bot (s!)") {
					if (!data.name.includes("@everyone") && !data.includes("@here")) {
						if ( !text.includes("@everyone") && !text.includes("@here")) {
							bot.channels.cache.get('856134736392486923').send('**' + this.public.name + ' said: **`' + text + '`');
						}
					}
				} 
				if(text.startsWith('s!')){
					text = text.slice(2)
					var cmd = text.split(' ')[0] 
					var oth = text.slice(cmd.length+1)
					if(Object.keys(commands).includes(cmd)){
						var command = commands[cmd](oth)
						setTimeout(function(){
							socket.emit('talk',{text:command})
						},100)
					}
				}
			})

			bot.on('message', msg => {
			  if (msg.author.id != "738460035373596683") {
				socket.emit('talk',{text:[msg.author.username + ' said: <small>' + msg.content + '</small>']})
			  }
			});