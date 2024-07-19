import sys
from PyQt5.QtWidgets import QApplication, QMainWindow, QPushButton, QVBoxLayout, QWidget, QSlider, QLabel
from PyQt5.QtMultimedia import QMediaPlayer, QMediaContent
from PyQt5.QtCore import Qt, QUrl

class AudioPlayer(QMainWindow):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("Simple Audio Player")

        # Initialize player
        self.player = QMediaPlayer()

        # Create buttons and slider
        self.play_button = QPushButton("Play")
        self.pause_button = QPushButton("Pause")
        self.volume_slider = QSlider(Qt.Horizontal)
        self.volume_label = QLabel("Volume")

        # Set slider range and default value
        self.volume_slider.setRange(0, 100)
        self.volume_slider.setValue(50)

        # Connect buttons and slider to functions
        self.play_button.clicked.connect(self.play_audio)
        self.pause_button.clicked.connect(self.pause_audio)
        self.volume_slider.valueChanged.connect(self.set_volume)

        # Set layout
        layout = QVBoxLayout()
        layout.addWidget(self.play_button)
        layout.addWidget(self.pause_button)
        layout.addWidget(self.volume_label)
        layout.addWidget(self.volume_slider)

        container = QWidget()
        container.setLayout(layout)
        self.setCentralWidget(container)

    def play_audio(self):
        audio_url = QUrl.fromLocalFile('/home/student/kidwaih1/Documents/CS/learn-language-audio/data/audio/tsd-audio.mp3')
        self.player.setMedia(QMediaContent(audio_url))
        self.player.play()

    def pause_audio(self):
        self.player.pause()

    def set_volume(self, value):
        self.player.setVolume(value)

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = AudioPlayer()
    window.show()
    sys.exit(app.exec_())
