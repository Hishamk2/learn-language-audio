document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audio');
    const toggleButton = document.getElementById('toggleButton');
    const contentDiv = document.getElementById('content');
    const transcribedDiv = document.getElementById('transcribed');
    const translatedDiv = document.getElementById('translated');

    let isSideBySide = true;
    let transcribedLines = [];
    let translatedLines = [];

    window.electron.receive('file-opened', (filePath) => {
        audio.src = filePath;
        audio.play();
    });

    // Listen for the srt-files-loaded event
    window.electron.receive('srt-files-loaded', (data) => {
        transcribedLines = data.transcribed.split('\n').filter(line => line.trim() !== '');
        translatedLines = data.translated.split('\n').filter(line => line.trim() !== '');
        updateView();
    });

    toggleButton.addEventListener('click', () => {
        isSideBySide = !isSideBySide;
        updateView();
        toggleButton.textContent = isSideBySide ? 'Switch to Line-by-Line View' : 'Switch to Side-by-Side View';
    });

    function updateView() {
        if (isSideBySide) {
            // Side-by-side view
            contentDiv.className = 'side-by-side';
            transcribedDiv.innerHTML = transcribedLines.join('<br>');
            translatedDiv.innerHTML = translatedLines.join('<br>');
        } else {
            // Alternating line-by-line view
            contentDiv.className = 'line-by-line';
            let combinedLines = [];

            // Ensure lines alternate correctly
            const maxLines = Math.max(transcribedLines.length, translatedLines.length);
            for (let i = 0; i < maxLines; i++) {
                const transcribedLine = transcribedLines[i] || ''; // Handle cases where one array is longer
                const translatedLine = translatedLines[i] || '';   // Handle cases where one array is longer
                combinedLines.push(`<div>${transcribedLine}</div><div>${translatedLine}</div>`);
            }
            transcribedDiv.innerHTML = combinedLines.join('');
            translatedDiv.innerHTML = ''; // Empty because translation is inline with transcription
        }
    }
});
