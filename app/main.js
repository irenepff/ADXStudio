var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var ipc = require('ipc');
var workspaceController = require('./workspace/workspaceController.js');

// Report crashes to our server.
//require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 800, height: 600});

    // and load the index.html of the app.
    mainWindow.loadUrl('file://' + __dirname + '/index.html');

    // Open the devtools.
    mainWindow.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {

    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});

ipc.on('explorer-ready', function(event) {
  var explorer=require('../src/explorer/explorer.js');
  explorer.load('C:/', function(err, files) {
    event.sender.send('loadFolder', err, files, 'root');
  });
});

ipc.on('explorer-loadfolder', function(event, path, elementid) {
  var explorer = require('../src/explorer/explorer.js');
console.log(path);
  explorer.load(path, function(err, files) {
    event.sender.send('loadFolder', err, files, elementid);
  });
});
