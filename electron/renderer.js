document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audio');
    const toggleButton = document.getElementById('toggleButton');
    const contentDiv = document.getElementById('content');

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
            contentDiv.innerHTML = '';

            const maxLines = Math.max(transcribedLines.length, translatedLines.length);
            for (let i = 0; i < maxLines; i++) {
                const transcribedLine = transcribedLines[i] || '';
                const translatedLine = translatedLines[i] || '';

                const lineContainer = document.createElement('div');
                lineContainer.classList.add('line-container');

                const transcribedDiv = document.createElement('div');
                transcribedDiv.classList.add('transcribed');
                transcribedDiv.textContent = transcribedLine;

                const translatedDiv = document.createElement('div');
                translatedDiv.classList.add('translated');
                translatedDiv.textContent = translatedLine;

                lineContainer.appendChild(transcribedDiv);
                lineContainer.appendChild(translatedDiv);
                contentDiv.appendChild(lineContainer);
            }
        } else {
            // Alternating line-by-line view
            contentDiv.className = 'line-by-line';
            contentDiv.innerHTML = '';

            const maxLines = Math.max(transcribedLines.length, translatedLines.length);
            for (let i = 0; i < maxLines; i++) {
                const transcribedLine = transcribedLines[i] || '';
                const translatedLine = translatedLines[i] || '';

                const transcribedDiv = document.createElement('div');
                transcribedDiv.classList.add('transcribed');
                transcribedDiv.textContent = transcribedLine;

                const translatedDiv = document.createElement('div');
                translatedDiv.classList.add('translated');
                translatedDiv.textContent = translatedLine;

                contentDiv.appendChild(transcribedDiv);
                contentDiv.appendChild(translatedDiv);
            }
        }
    }
});
