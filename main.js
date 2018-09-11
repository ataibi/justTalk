const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, Tray} = electron;

const appIconPath = path.join(__dirname, 'images/appIcon.png');
const appIcon = electron.nativeImage.createFromPath(appIconPath);
let mainWindow;

app.on('ready', function(){
  const appTray = new Tray(appIcon);

  // Create mainWindow
  mainWindow = new BrowserWindow({
    show: false,
    icon: appIconPath,
    tray: appTray,
    title: 'Just Talk'
    });
  // load html
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'html/mainWindow.html'),
    protocol:'file:',
    slashes: true // equals file://workingDir/mainWindow.html
  }));
  // Make it main window e.g. quit app on close
  mainWindow.on('closed', function(){
    app.quit();
  });
  // build the menu
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // insert it
  Menu.setApplicationMenu(mainMenu);
  mainWindow.once('ready-to-show', ()=>{
    mainWindow.show()
  });
});

// handle create new conversation window
function createNewConversationWindow(){
  NewConversationWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'New Conversation',
  });
  NewConversationWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'html/NewConversationWindow.html'),
    protocol: 'file:',
    slashes: true
  }));
  // clear memory on close
  NewConversationWindow.on('close', function (){
    newConversationWindow = null;
  });
}

// creating menu
const mainMenuTemplate = [
  {
    label: 'File',
    submenu:[
      {
        label: 'New Conversation',
        accelerator: process.platform == 'darwin' ? 'Command+N' : 'Ctrl+N',
        click(){
          createNewConversationWindow();
        }
      },
      {
        label: 'Clear All Conversations'
      },
      {
        label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click(){
          app.quit();
        }
      }
    ]
  }
];

// force 'file' menu item to be first on mac
if (process.platform == 'darwin'){
  mainMenuTemplate.unshit({});
}


// add developer tools if in beta
if (process.env.NODE_ENV != 'production'){
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu:[
      {
        label: 'Toggle Dev Tools',
        accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow)
        {
          focusedWindow.toggleDevTools();
        }
      },
      {
        label: 'Reload window',
        accelerator: process.platform == 'darwin' ? 'Command+R' : 'Ctrl+R',
        role: 'reload'
      }
    ]
  })
}
