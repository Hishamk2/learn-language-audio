import sys
from PyQt5.QtWidgets import QApplication, QMainWindow, QTextEdit, QVBoxLayout, QWidget
from PyQt5.QtCore import Qt

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("Transcription and Translation Display")
        self.setGeometry(100, 100, 800, 600)

        # Create widgets
        self.original_text_edit = QTextEdit()
        self.translated_text_edit = QTextEdit()

        # Set read-only
        self.original_text_edit.setReadOnly(True)
        self.translated_text_edit.setReadOnly(True)

        # Read text content from files
        original_text = self.read_text_file('data/transcriptions/tsd-urdu.txt')
        translated_text = self.read_text_file('data/translations/tsd-english.txt')

        # Set text content
        self.original_text_edit.setPlainText(original_text)
        self.translated_text_edit.setPlainText(translated_text)

        # Layout
        layout = QVBoxLayout()
        layout.addWidget(self.original_text_edit)
        layout.addWidget(self.translated_text_edit)

        # Central widget
        central_widget = QWidget()
        central_widget.setLayout(layout)
        self.setCentralWidget(central_widget)

    def read_text_file(self, file_path):
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                return file.read()
        except Exception as e:
            return f"Error reading file {file_path}: {e}"

if __name__ == "__main__":
    app = QApplication(sys.argv)
    main_window = MainWindow()
    main_window.show()
    sys.exit(app.exec_())
