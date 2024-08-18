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

    window.electron.receive('txt-files-loaded', (data) => {
        console.log(data);
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
        // Clear the contentDiv to remove any previous content
        contentDiv.innerHTML = '';
    
        if (isSideBySide) {
            // Set up side-by-side view
            contentDiv.className = 'side-by-side';
    
            // Create and append transcribedDiv
            const transcribedDiv = document.createElement('div');
            transcribedDiv.id = 'transcribed';
            transcribedDiv.className = 'transcribed';
            transcribedDiv.innerHTML = transcribedLines.map(line => `<p>${line}</p>`).join('');
            contentDiv.appendChild(transcribedDiv);
    
            // Create and append translatedDiv
            const translatedDiv = document.createElement('div');
            translatedDiv.id = 'translated';
            translatedDiv.className = 'translated';
            translatedDiv.innerHTML = translatedLines.map(line => `<p>${line}</p>`).join('');
            contentDiv.appendChild(translatedDiv);
    
        } else {
            // Set up line-by-line view
            contentDiv.className = 'line-by-line';
    
            const maxLines = Math.max(transcribedLines.length, translatedLines.length);
            let combinedHTML = '';
            for (let i = 0; i < maxLines; i++) {
                const transcribedLine = transcribedLines[i] || '';
                const translatedLine = translatedLines[i] || '';
                combinedHTML += `<p>${transcribedLine}</p><p>${translatedLine}</p>`;
            }
            contentDiv.innerHTML = combinedHTML;
        }
    }
});
