// main.js

const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

const savedWordsFilePath = path.join(app.getPath('userData'), 'savedWords.json');
// console.log('Saved words file path:', savedWordsFilePath);

function loadSavedWords() {
    try {
        if (fs.existsSync(savedWordsFilePath)) {
            const savedWordsData = fs.readFileSync(savedWordsFilePath);
            return JSON.parse(savedWordsData);
        }
    } catch (error) {
        console.error('Error loading saved words:', error);
    }
    return [];
}

// Function to save words to file
function saveWord(word) {
    let savedWords = loadSavedWords();
    if (!savedWords.includes(word)) {
        savedWords.push(word);
        fs.writeFileSync(savedWordsFilePath, JSON.stringify(savedWords));
    }
}

ipcMain.on('save-word', (event, word) => {
    saveWord(word);
});


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

        // Send the saved words to the renderer process when the application starts
        const savedWords = loadSavedWords();
        mainWindow.webContents.send('load-saved-words', savedWords);
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
const axios = require('axios');

// Function to detect the language of the word
function detectLanguage(word) {
    const urduRegex = /[\u0600-\u06FF]/;  // Unicode range for Urdu characters
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;  // Unicode range for Arabic characters (includes Urdu)
    
    if (urduRegex.test(word)) {
        return 'ur';  // Urdu
    } else if (arabicRegex.test(word)) {
        return 'ar';  // Arabic (if needed)
    } else {
        return 'en';  // Default to English
    }
}

ipcMain.on('lookup-definition', async (event, word) => {
    const language = detectLanguage(word);  // Detect the language
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/${language}/${word}`;  // Use the correct endpoint

    console.log(`Looking up word: ${word} in language: ${language}`);

    try {
        const response = await axios.get(apiUrl);
        const definition = response.data[0].meanings[0].definitions[0].definition;

        event.reply('show-definition', definition);
    } catch (error) {
        console.error('Error fetching the definition:', error);
        event.reply('show-definition', 'Definition not found.');
    }
});


