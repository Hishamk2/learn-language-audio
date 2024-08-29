const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // Function to send messages to the main process
    lookupDefinition: (word) => {
        ipcRenderer.send('lookup-definition', word);
    },
    saveWord: (word) => {
        ipcRenderer.send('save-word', word);
    },
    receive: (channel, func) => {
        let validChannels = ['file-opened', 'txt-files-loaded', 'show-definition', 'load-saved-words'];
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    }
});
