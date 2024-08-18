// renderer.js

document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audio');
    const toggleButton = document.getElementById('toggleButton');
    const contentDiv = document.getElementById('content');
    const transcribedDiv = document.getElementById('transcribed');
    const translatedDiv = document.getElementById('translated');
    const zoomInButton = document.getElementById('zoomIn');
    const zoomOutButton = document.getElementById('zoomOut');

    let isSideBySide = true;
    let transcribedLines = [];
    let translatedLines = [];
    let zoomLevel = 1;

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

    zoomInButton.addEventListener('click', () => {
        zoomLevel += 0.1;
        updateZoom();
    });

    zoomOutButton.addEventListener('click', () => {
        zoomLevel = Math.max(0.5, zoomLevel - 0.1);
        updateZoom();
    });

    function updateZoom() {
        contentDiv.style.transform = `scale(${zoomLevel})`;
        contentDiv.style.transformOrigin = '0 0';
    }

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

        updateZoom();  // Apply the zoom level to the new content
    }
});
