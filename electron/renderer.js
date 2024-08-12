document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audio');

    window.electron.receive('file-opened', (filePath) => {
        audio.src = filePath;
        audio.play();
    });

    // Listen for the srt-files-loaded event
    window.electron.receive('srt-files-loaded', (data) => {
        const transcribedDiv = document.getElementById('transcribed');
        const translatedDiv = document.getElementById('translated');

        // Populate the divs with the content of the .srt files
        transcribedDiv.textContent = data.transcribed;
        translatedDiv.textContent = data.translated;
    });
});
