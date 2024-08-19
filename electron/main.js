// main.js

const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

// Hardcoded paths to the .srt files
const transcribedFilePath = '/home/hisham-kidwai/Documents/HISHAM/Computer Science/learn-language-audio/Whisper Testing/test-whisper/med/ur/test.txt';
const translatedFilePath = '/home/hisham-kidwai/Documents/HISHAM/Computer Science/learn-language-audio/Whisper Testing/test-whisper/med/en/test.txt';

// Define the menu items
const menuItems = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Open File',
                accelerator: 'CmdOrCtrl+O',
                click() {
                    openFile();
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
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false
        }
    });

    mainWindow.loadFile('index.html');
    
    const transcribedContent = fs.readFileSync(transcribedFilePath, 'utf-8');
    const translatedContent = fs.readFileSync(translatedFilePath, 'utf-8');
    
    const transcribedSRTContent = fs.readFileSync(transcribedFilePath.replace('.txt', '.srt'), 'utf-8');
    const translatedSRTContent = fs.readFileSync(translatedFilePath.replace('.txt', '.srt'), 'utf-8');

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('txt-files-loaded', {
            transcribed: transcribedContent,
            translated: translatedContent,
            transcribedSRT: transcribedSRTContent,
            translatedSRT: translatedSRTContent
        });
    });

    // mainWindow.webContents.openDevTools();
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


function openFile() {
    const mainWindow = BrowserWindow.getFocusedWindow();    
    dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [{ name: 'Audio Files', extensions: ['mp3', 'wav', 'ogg'] }]
    }).then(result => {
        if (!result.canceled && result.filePaths.length > 0) {
            const filePath = result.filePaths[0];
            mainWindow.webContents.send('file-opened', filePath);
        }
    }).catch(err => {
        console.error('Error opening file:', err);
    });
}