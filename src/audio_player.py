import sys
from PyQt5.QtWidgets import QApplication, QMainWindow, QPushButton, QVBoxLayout, QWidget, QSlider, QLabel, QHBoxLayout, QSizePolicy, QShortcut
from PyQt5.QtMultimedia import QMediaPlayer, QMediaContent
from PyQt5.QtCore import Qt, QUrl, QTime
from PyQt5.QtGui import QKeySequence

class AudioPlayer(QMainWindow):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("Simple Audio Player")

        # Initialize player
        self.player = QMediaPlayer()
        self.player.positionChanged.connect(self.update_position)
        self.player.durationChanged.connect(self.update_duration)
        self.player.stateChanged.connect(self.update_button_text)

        # Create buttons and sliders
        self.play_button = QPushButton("Play")
        self.pause_button = QPushButton("Pause")
        self.seek_slider = QSlider(Qt.Horizontal)
        self.volume_slider = QSlider(Qt.Horizontal)
        self.volume_label = QLabel("Volume")
        self.time_label = QLabel("00:00 / 00:00")

        # Set slider range and default value
        self.volume_slider.setRange(0, 100)
        self.volume_slider.setValue(50)
        self.seek_slider.setRange(0, 0)  # Will be updated when audio is loaded

        # Connect buttons and sliders to functions
        self.play_button.clicked.connect(self.play_audio)
        self.pause_button.clicked.connect(self.toggle_pause)
        self.volume_slider.valueChanged.connect(self.set_volume)
        self.seek_slider.sliderMoved.connect(self.seek_audio)

        # Set layout
        controls_layout = QHBoxLayout()
        controls_layout.addWidget(self.play_button)
        controls_layout.addWidget(self.pause_button)
        controls_layout.addWidget(self.volume_label)
        controls_layout.addWidget(self.volume_slider)

        main_layout = QVBoxLayout()
        main_layout.addWidget(self.time_label)
        main_layout.addWidget(self.seek_slider)
        main_layout.addLayout(controls_layout)

        container = QWidget()
        container.setLayout(main_layout)
        self.setCentralWidget(container)

        # Add shortcut for playing and pausing audio
        self.play_pause_shortcut = QShortcut(QKeySequence("Space"), self)
        self.play_pause_shortcut.activated.connect(self.toggle_pause)

    def play_audio(self):
        audio_url = QUrl.fromLocalFile("/home/student/kidwaih1/Documents/CS/learn-language-audio/data/audio/tsd-audio.mp3")  # Use the specified path to your audio file
        self.player.setMedia(QMediaContent(audio_url))
        self.player.play()

    def toggle_pause(self):
        if self.player.state() == QMediaPlayer.PlayingState:
            self.player.pause()
        else:
            self.player.play()

    def set_volume(self, value):
        self.player.setVolume(value)

    def seek_audio(self, position):
        self.player.setPosition(position)

    def update_position(self, position):
        self.seek_slider.setValue(position)
        self.update_time_label(position, self.player.duration())

    def update_duration(self, duration):
        self.seek_slider.setRange(0, duration)

    def update_time_label(self, position, duration):
        pos_time = QTime(0, 0, 0).addMSecs(position)
        dur_time = QTime(0, 0, 0).addMSecs(duration)
        self.time_label.setText(f"{pos_time.toString('mm:ss')} / {dur_time.toString('mm:ss')}")

    def update_button_text(self, state):
        if state == QMediaPlayer.PlayingState:
            self.pause_button.setText("Pause")
        else:
            self.pause_button.setText("Resume")

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = AudioPlayer()
    window.show()
    sys.exit(app.exec_())
