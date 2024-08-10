const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');

// Define the menu items
const menuItems = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Open',
                click: async () => {
                    const mainWindow = BrowserWindow.getFocusedWindow(); // Get the currently focused window
                    const result = await dialog.showOpenDialog(mainWindow, {
                        properties: ['openFile'],
                        filters: [{ name: 'Audio Files', extensions: ['mp3', 'wav', 'ogg'] }]
                    });
                    if (result.filePaths.length > 0) {
                        mainWindow.webContents.send('file-selected', result.filePaths[0]);
                    }
                }
            }
        ]
        
    }
];

const menu = Menu.buildFromTemplate(menuItems);
Menu.setApplicationMenu(menu);

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Preload script
            contextIsolation: true, // Ensure context isolation
            enableRemoteModule: false, // Disable the remote module
            nodeIntegration: false // Disable Node integration in renderer
        }
    });

    mainWindow.loadFile('index.html');

    // mainWindow.webContents.on('did-finish-load', () => {
    //     dialog.showOpenDialog({
    //         defaultPath:app.getPath('music'),
    //         buttonLabel: 'Select',
            
    //     })
    // });
    
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});



// ipcMain.handle('dialog:openFile', async () => {
//     const result = await dialog.showOpenDialog({
//         properties: ['openFile'],
//         filters: [{ name: 'Audio Files', extensions: ['mp3', 'wav', 'ogg'] }]
//     });
//     return result.filePaths[0];
// });
