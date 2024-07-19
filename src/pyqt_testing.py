import sys
from PyQt5.QtWidgets import QApplication, QMainWindow, QTextEdit, QVBoxLayout, QHBoxLayout, QWidget, QRadioButton, QButtonGroup

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("Transcription and Translation Display")
        self.setGeometry(100, 100, 800, 600)

        # Create widgets
        self.original_text_edit = QTextEdit()
        self.translated_text_edit = QTextEdit()
        self.combined_text_edit = QTextEdit()

        # Set read-only
        self.original_text_edit.setReadOnly(True)
        self.translated_text_edit.setReadOnly(True)
        self.combined_text_edit.setReadOnly(True)

        # Read and process text content from files
        original_text_lines = self.read_and_process_text_file('data/transcriptions/tsd-urdu.txt')
        translated_text_lines = self.read_and_process_text_file('data/translations/tsd-english.txt')

        # Set initial text content
        self.original_text_edit.setPlainText("\n".join(original_text_lines))
        self.translated_text_edit.setPlainText("\n".join(translated_text_lines))
        self.combined_text_edit.setPlainText(self.combine_texts_alternating_lines(original_text_lines, translated_text_lines))

        # Layout
        self.layout = QVBoxLayout()

        # Add radio buttons for display options
        self.side_by_side_radio = QRadioButton("Side by Side")
        self.alternating_lines_radio = QRadioButton("Alternating Lines")
        self.side_by_side_radio.setChecked(True)  # Default to side by side

        self.radio_group = QButtonGroup()
        self.radio_group.addButton(self.side_by_side_radio)
        self.radio_group.addButton(self.alternating_lines_radio)

        self.radio_layout = QHBoxLayout()
        self.radio_layout.addWidget(self.side_by_side_radio)
        self.radio_layout.addWidget(self.alternating_lines_radio)

        self.layout.addLayout(self.radio_layout)

        # Add text display widgets
        self.side_by_side_layout = QHBoxLayout()
        self.side_by_side_layout.addWidget(self.original_text_edit)
        self.side_by_side_layout.addWidget(self.translated_text_edit)

        self.layout.addLayout(self.side_by_side_layout)
        self.layout.addWidget(self.combined_text_edit)

        self.original_text_edit.setVisible(True)
        self.translated_text_edit.setVisible(True)
        self.combined_text_edit.setVisible(False)

        # Connect radio buttons to method
        self.radio_group.buttonClicked.connect(self.toggle_display_mode)

        central_widget = QWidget()
        central_widget.setLayout(self.layout)
        self.setCentralWidget(central_widget)

    def read_and_process_text_file(self, file_path):
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                lines = file.readlines()
                # Filter out timestamps
                text_lines = [line for line in lines if not any(char.isdigit() for char in line.split(' ')[0])]
                return text_lines
        except Exception as e:
            return [f"Error reading file {file_path}: {e}"]

    def combine_texts_alternating_lines(self, original_lines, translated_lines):
        combined_lines = []
        for original, translated in zip(original_lines, translated_lines):
            combined_lines.append(original.strip())
            combined_lines.append(translated.strip())
        return "\n".join(combined_lines)

    def toggle_display_mode(self):
        if self.side_by_side_radio.isChecked():
            self.original_text_edit.setVisible(True)
            self.translated_text_edit.setVisible(True)
            self.combined_text_edit.setVisible(False)
        else:
            self.original_text_edit.setVisible(False)
            self.translated_text_edit.setVisible(False)
            self.combined_text_edit.setVisible(True)

if __name__ == "__main__":
    app = QApplication(sys.argv)
    main_window = MainWindow()
    main_window.show()
    sys.exit(app.exec_())
