// renderer.js
document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audio');

    window.electron.receive('file-selected', (filePath) => {
        audio.src = filePath;
        audio.play();
    });
});
