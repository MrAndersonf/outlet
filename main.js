const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
let dados = ""

require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});

function createWindow() {
  let win = new BrowserWindow({
    width: 1300,
   
    height: 625,
   
    frame: false,
    resizable:false,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: false
    }
  })
  win.loadFile('home.html')
}
app.whenReady().then(createWindow)

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