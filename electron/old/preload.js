// preload.js
const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

contextBridge.exposeInMainWorld('electronAPI', {
    readFile: (filePath, callback) => {
        fs.readFile(filePath, 'utf8', callback);
    },
    pathJoin: (...args) => path.join(...args)
});
