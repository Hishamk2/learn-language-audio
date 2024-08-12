const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    receive: (channel, func) => {
        let validChannels = ['file-opened', 'srt-files-loaded']; // List of channels you want to allow
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    }
});
