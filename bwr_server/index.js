// ========================================================================
// Server init
// ========================================================================

// Filesystem reading functions
const fs = require('fs-extra');

// Load settings
try {
	stats = fs.lstatSync('settings.json');
} catch (e) {
	// If settings do not yet exist
	if (e.code == "ENOENT") {
		try {
			fs.copySync(
				'settings.example.json',
				'settings.json'
			);
			console.log("Created new settings file.");
		} catch(e) {
			console.log(e);
			throw "Could not create new settings file.";
		}
	// Else, there was a misc error (permissions?)
	} else {
		console.log(e);
		throw "Could not read 'settings.json'.";
	}
}

// Load settings into memory
const settings = require("./settings.json");

// Setup basic express server
var express = require('express');
var app = express();  
var cors = require("cors")
var http = require("http");
const url = require('url');
if (settings.express.serveStatic)
	app.use(express.static('../build/www/', {
		extensions: ['html']
	}));

var credentials = {  key: fs.readFileSync('./privkey3.pem'), cert: fs.readFileSync('./cert3.pem')};
var server = require('https').createServer(credentials, app);
  
server.listenerCount(1);
// Init socket.io
var io = require('socket.io')(server);
var port = process.env.PORT || settings.port;
exports.io = io;

// Init sanitize-html
var sanitize = require('sanitize-html');

// Init winston loggers (hi there)
const Log = require('./log.js');
Log.init();
const log = Log.log;

// Load ban list
const Ban = require('./ban.js');
Ban.init();
 
// Start actually listening
server.listen(448, function () {
	console.log(
		"Welcome to BonziWORLD Revived developer build 2.3.1-SNAPSHOT!\n",
		"Time to meme!\n",
		"----------------------\n",
		"HTTPS Server listening at port " + port + "\n",
		"----------------------Logs----------------------\n"
	);
});
app.options('*', cors())
app.use(express.static(__dirname + '/public', {
	extensions: ['html']
}));
app.get('/api/v1/', (req, res) => res.sendStatus('hello world'))
app.get('/api/v1/rooms/', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(require('./rooms.json')));
})
const { exec } = require("child_process");
app.use(function(req,res){
	res.status(200).type('html').sendFile(__dirname + '/200.html')
})
// ========================================================================
// Banning functions
// ========================================================================

// ========================================================================
// Helper functions
// ========================================================================

const Utils = require("./utils.js")

// ========================================================================
// The Beef(TM)
// ========================================================================

const Meat = require("./meat.js");
Meat.beat();
// Console commands
const Console = require('./console.js');
Console.listen();
