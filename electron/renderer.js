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
            // Clear and setup side-by-side view
            contentDiv.className = 'side-by-side';
            transcribedDiv.innerHTML = transcribedLines.map(line => `<div>${line}</div>`).join('');
            translatedDiv.innerHTML = translatedLines.map(line => `<div>${line}</div>`).join('');
        } else {
            // Clear and setup line-by-line view
            contentDiv.className = 'line-by-line';
            contentDiv.innerHTML = '';

            const maxLines = Math.max(transcribedLines.length, translatedLines.length);
            let combinedHTML = '';
            for (let i = 0; i < maxLines; i++) {
                const transcribedLine = transcribedLines[i] || '';
                const translatedLine = translatedLines[i] || '';
                combinedHTML += `<div>${transcribedLine}</div><div>${translatedLine}</div>`;
            }
            contentDiv.innerHTML = combinedHTML;
        }
    }
});
