const { app, Menu, ipcMain, BrowserWindow } = require('electron')
const path = require('path')
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

const isMac = process.platform === 'darwin'

const template = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  // { role: 'fileMenu' }
  {
    label: 'Menu',
    submenu: [
      {
        label: 'Produtos',
        submenu: [
          {
            label: "Novo",
            click: async () => product()
              
          }]
      }
    ]
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac ? [
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [
            { role: 'startSpeaking' },
            { role: 'stopSpeaking' }
          ]
        }
      ] : [
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ])
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac ? [
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' }
      ] : [
        { role: 'close' }
      ])
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://electronjs.org')
        }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

let dados = ""

require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});

function mainWindow() {
  let win = new BrowserWindow({
   minWidth: 1300,
    width: 1300,
    minHeight: 710,
    height: 660,
    frame: true,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: false
    }
  })
  win.loadFile('./src/Screens/Home/index.html')
}


function product() {
  let win = new BrowserWindow({
     minWidth: 1300,
    width: 1300,
    minHeight: 660,
    height: 660,
    frame: true,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: false
    }
  })
  win.loadFile('cadastro.html')
}
app.whenReady().then(mainWindow)

let atualiza = null;
ipcMain.on("atualiza_item", (event, args) => {
  atualiza = new BrowserWindow({
    width: 450,
    height: 500,
    webPreferences: {
      nodeIntegration: true
    }
  })
  console.log(args);
  dados = args;
  atualiza.loadFile('atualiza.html')
})


ipcMain.on('argumentos_busca', (event) => {
  event.reply('argumentos-reply', dados)
  dados = "";
})

ipcMain.on('fechar_atualizar', (event) => {
  event.reply("notificar");
  setTimeout(() => {
    atualiza.close();
    atualiza = null;
  }, 1000)

})