var socketio = require('socket.io');
var io = null;
var guestNumber = 1;
var nickNames = {};
var nameUsed = [];
var currentRomm = {};