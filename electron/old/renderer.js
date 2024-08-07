window.addEventListener('DOMContentLoaded', () => {
    const transcribedFilePath = '/home/hisham-kidwai/Documents/HISHAM/Computer Science/learn-language-audio/data/transcriptions/tsd-urdu.txt'
    const translatedFilePath = '/home/hisham-kidwai/Documents/HISHAM/Computer Science/learn-language-audio/data/translations/tsd-english.txt' 

    const transcribedTextElement = document.getElementById('transcribed-text');
    const translatedTextElement = document.getElementById('translated-text');

    window.electronAPI.readFile(transcribedFilePath, (err, data) => {
        if (err) {
            console.error('Failed to read transcribed file:', err);
            return;
        }
        transcribedTextElement.textContent = data;
    });

    window.electronAPI.readFile(translatedFilePath, (err, data) => {
        if (err) {
            console.error('Failed to read translated file:', err);
            return;
        }
        translatedTextElement.textContent = data;
    });
});
