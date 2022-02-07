// Modules to control application life and create native browser window
const {app, BrowserWindow, screen,ipcMain,Tray,Menu} = require('electron')
const path = require('path')
const log = require('electron-log');
const jetpack = require('fs-jetpack').cwd(app.getAppPath());
var network = require('network');
const child_process = require('child_process');
const dialog = require('electron').dialog;
var sudo = require('sudo-prompt');
var options = {
  name: 'SPIE'
};



//GLOBAL VARS
var mainWindow
var profileManager
let profileArr = JSON.parse(jetpack.read(path.join(__dirname+'/resources/config/profiles.txt')))

log.info(profileArr)

function createMainWindow (width,height) {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    show:false,
    frame: false,
    alwaysOnTop:true,
    x: width - 600,
    y: height- 440,
    webPreferences:{
      nodeIntegration:true,
      enableRemoteModule:true
    }
  })

  mainWindow.loadFile('index.html')
  //mainWindow.openDevTools()

  network.get_interfaces_list(function(err, obj) {

    mainWindow.webContents.send('load-interfaces',obj) 
    mainWindow.webContents.send('load-profiles',profileArr) 

  })

let tray = null;
//  tray documentation at - https://github.com/electron/electron/blob/main/docs/api/menu-item.md
const template = [
  {
      label: 'SPIE IP-Changer',
      enabled: false,
  },
  {
    type: 'separator',
  },
  {
    label: 'Öffnen', click: function () {
        mainWindow.show();
    },
  },
  {
    label: 'Profile verwalten', click: function () {
      createProfileManager();
    },
  },
  {
      type: 'separator',
  },
  {
    label: 'Über',click:function() {
      createAbout();
    },
  },
  {
    type: 'separator',
  },
  {
      label: 'Beenden', click: function () {
          app.quit();
      },
  },
];
const contextMenu = Menu.buildFromTemplate(template);
tray = new Tray(path.join(__dirname,'/resources/img/icon.ico'));
tray.setContextMenu(contextMenu);
tray.setToolTip('SPIE IP-Changer');
  

ipcMain.on('minimize-tray', (event,args) => {
    if (tray) { return mainWindow.hide(); }
})

}

function createProfileManager () {
  profileManager = new BrowserWindow({
    width: 1000,
    height: 700,
    show:false,
    frame: false,
    webPreferences:{
      nodeIntegration:true,
      enableRemoteModule:true
    }
  })

  profileManager.loadFile('profiles.html')
  //profileManager.openDevTools()

  profileManager.on('ready-to-show',function(){
    profileManager.webContents.send('load-profile',profileArr)  
    profileManager.show()
  })

  profileManager.on('closed', function(){

    mainWindow.show()
  
  })

}

var aboutWin
function createAbout () {
  aboutWin = new BrowserWindow({
    width: 600,
    height: 300,
    show:true,
    frame:false,
    webPreferences:{
      nodeIntegration:true,
      enableRemoteModule:true
    }
  })

  aboutWin.loadFile('about.html')
  //aboutWin.openDevTools()
}



ipcMain.on('manage-profiles', (event,args) => {
  
  event.returnValue = 'received'
  log.info('received')
  mainWindow.hide()
  createProfileManager()

})

ipcMain.on('update-profiles', (event,args) => {

  profileArr = args
  jetpack.write(__dirname+'/resources/config/profiles.txt',JSON.stringify(args));
  profileManager.webContents.send('load-profile',profileArr)  

})

ipcMain.on('update-ip-address',(event,args) => {

  log.info("Applying Profile:"+args.name+". To Interface: "+args.interface)

  if(args.name == "dhcp"){

    sudo.exec('netsh interface ipv4 set address name="'+args.interface+'" dhcp && netsh interface ip set dns "'+args.interface+'" dhcp', options,
    function(error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        setTimeout(() => {
    
          network.get_interfaces_list(function(err, obj) {
      
            mainWindow.webContents.send('load-interfaces',obj) 
            mainWindow.webContents.send('load-profiles',profileArr)
        
          })
      
        }, 2000);
    });

  } else {


    sudo.exec('netsh interface ipv4 set address name="'+args.interface+'" static '+args.ip+' '+args.netmask+' '+args.gateway+' && netsh interface ip set dns "'+args.interface+'" static '+args.dns1+' && netsh interface ip add dns "'+args.interface+'" static '+args.dns2+'', options,
  function(error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    setTimeout(() => {
    
      network.get_interfaces_list(function(err, obj) {
  
        mainWindow.webContents.send('load-interfaces',obj) 
        mainWindow.webContents.send('load-profiles',profileArr)
    
      })
  
    }, 2000);
  });


  }

  
 
})

app.whenReady().then(() => {

  


  let display = screen.getPrimaryDisplay();
  let width = display.bounds.width;
  let height = display.bounds.height;

  createMainWindow(width,height)


})


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

