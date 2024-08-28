// renderer.js

document.addEventListener('DOMContentLoaded', () => {
    window.electronAPI.lookupDefinition('test');  // Replace 'test' with an English word

    
    document.addEventListener('dblclick', function () {
        let selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            const popup = document.getElementById('definitionPopup');

            // Position the popup just above the selected text
            popup.style.left = `${rect.left + window.scrollX}px`;
            popup.style.top = `${rect.top + window.scrollY - popup.offsetHeight}px`;

            // Send the selected word to the main process to look up the definition
            window.electronAPI.lookupDefinition(selectedText);
        }
    });

    window.electronAPI.receive('show-definition', (definition) => {
        const popup = document.getElementById('definitionPopup');
        popup.innerText = definition;
        popup.style.display = 'block';
    });
    
    document.addEventListener('click', () => {
        const popup = document.getElementById('definitionPopup');
        popup.style.display = 'none';
    });
    
    
    
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

    let transcribedEntries = [];
    let translatedEntries = [];

    window.electronAPI.receive('file-opened', (filePath) => {
        audio.src = filePath;
        audio.play();
    });

    window.electronAPI.receive('txt-files-loaded', (data) => {
        transcribedLines = data.transcribed.split('\n').filter(line => line.trim() !== '');
        translatedLines = data.translated.split('\n').filter(line => line.trim() !== '');

        transcribedEntries = parseSRT(data.transcribedSRT);
        translatedEntries = parseSRT(data.translatedSRT);

        console.log('Transcribed Entries:', transcribedEntries);
        console.log('Translated Entries:', translatedEntries);

        updateView();
    });

    function parseSRT(srtContent) {
        const pattern = /(\d+)\s+(\d{2}):(\d{2}):(\d{2}),(\d{3}) --> (\d{2}):(\d{2}):(\d{2}),(\d{3})\s+([\s\S]+?)(?=\n{2,}|\n*$)/g;
        const entries = [];
        let match;

        while ((match = pattern.exec(srtContent)) !== null) {
            const startTime = parseInt(match[2]) * 3600 + parseInt(match[3]) * 60 + parseInt(match[4]) + parseInt(match[5]) / 1000;
            const endTime = parseInt(match[6]) * 3600 + parseInt(match[7]) * 60 + parseInt(match[8]) + parseInt(match[9]) / 1000;
            const text = match[10].replace(/\n/g, ' ');
            entries.push({ startTime, endTime, text });
        }

        return entries;
    }
    
    audio.addEventListener('timeupdate', () => {
        const currentTime = audio.currentTime;
        console.log(`Current Audio Time: ${currentTime}`);
        highlightCurrentSentence(currentTime);
    });

    function highlightCurrentSentence(currentTime) {
        const transcribedIndex = transcribedEntries.findIndex(entry => currentTime >= entry.startTime && currentTime <= entry.endTime);
        const translatedIndex = translatedEntries.findIndex(entry => currentTime >= entry.startTime && currentTime <= entry.endTime);
    
        console.log(`Transcribed Index: ${transcribedIndex}, Translated Index: ${translatedIndex}`);
    
        if (isSideBySide) {
            if (transcribedIndex !== -1) {
                transcribedDiv.innerHTML = transcribedEntries.map((entry, i) => `<p class="${i === transcribedIndex ? 'highlight' : ''}">${entry.text}</p>`).join('');
            }
    
            if (translatedIndex !== -1) {
                translatedDiv.innerHTML = translatedEntries.map((entry, i) => `<p class="${i === translatedIndex ? 'highlight' : ''}">${entry.text}</p>`).join('');
            }
        } else {
            if (transcribedIndex !== -1 && translatedIndex !== -1) {
                const combinedHTML = transcribedEntries.map((entry, i) => {
                    const transcribedLine = transcribedEntries[i] ? `<p class="${i === transcribedIndex ? 'highlight' : ''}">${transcribedEntries[i].text}</p>` : '';
                    const translatedLine = translatedEntries[i] ? `<p class="${i === translatedIndex ? 'highlight' : ''}">${translatedEntries[i].text}</p>` : '';
                    return `${transcribedLine}${translatedLine}`;
                }).join('');
                contentDiv.innerHTML = combinedHTML;
            }
        }
    }
    

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
    
            transcribedDiv.innerHTML = transcribedEntries.map(entry => `<p>${entry.text}</p>`).join('');
            translatedDiv.innerHTML = translatedEntries.map(entry => `<p>${entry.text}</p>`).join('');
    
            contentDiv.appendChild(transcribedDiv);
            contentDiv.appendChild(translatedDiv);
        } else {
            // Set up line-by-line view
            contentDiv.className = 'line-by-line';
    
            const maxLines = Math.max(transcribedEntries.length, translatedEntries.length);
            let combinedHTML = '';
            for (let i = 0; i < maxLines; i++) {
                const transcribedLine = transcribedEntries[i] ? transcribedEntries[i].text : '';
                const translatedLine = translatedEntries[i] ? translatedEntries[i].text : '';
                combinedHTML += `<p>${transcribedLine}</p><p>${translatedLine}</p>`;
            }
            contentDiv.innerHTML = combinedHTML;
        }
    }
});
