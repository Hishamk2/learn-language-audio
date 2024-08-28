const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // Function to send messages to the main process
    lookupDefinition: (word) => {
        ipcRenderer.send('lookup-definition', word);
    },

    // Function to receive messages from the main process
    receive: (channel, func) => {
        let validChannels = ['file-opened', 'txt-files-loaded', 'show-definition'];
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    }
});
