// renderer.js
document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audio');
    const uploadButton = document.getElementById('uploadButton');

    uploadButton.addEventListener('click', async () => {
        const filePath = await window.electron.openFileDialog();
        if (filePath) {
            audio.src = filePath;
            audio.play();
        }
    });
});
