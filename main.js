// Modules to control application life and create native browser window
const {app, BrowserWindow, screen,ipcMain} = require('electron')
const path = require('path')
const log = require('electron-log');

var network = require('network');
 

  
function createMainWindow (width,height) {
  const mainWindow = new BrowserWindow({
    width: 500,
    height: 300,
    show:false,
    frame: false,
    x: width - 500,
    y: height- 340,
    webPreferences:{
      nodeIntegration:true,
      enableRemoteModule:true
    }
  })

  mainWindow.loadFile('index.html')
  mainWindow.openDevTools()

  network.get_interfaces_list(function(err, obj) {

    mainWindow.webContents.send('load-interfaces',obj)  
    mainWindow.show()

  })
}


app.whenReady().then(() => {

  


  let display = screen.getPrimaryDisplay();
  let width = display.bounds.width;
  let height = display.bounds.height;

  createMainWindow(width,height)


})


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

