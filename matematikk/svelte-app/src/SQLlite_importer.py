import sqlite3
import json

# Åpne JSON-filen og les data
with open('mathquiz.json', 'r') as file:
    data = json.load(file)

# Opprett en ny SQLite-database eller koble til en eksisterende
conn = sqlite3.connect('mathquestions.db')
cursor = conn.cursor()

# Opprett en ny tabell for spørsmål
cursor.execute('''
CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY,
    category TEXT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    hint TEXT
)
''')

# Legg til spørsmål fra JSON-filen til databasen
for category_data in data:
    for category, questions in category_data.items():
        for question_data in questions:
            try:
                question = question_data['question']
                answer = question_data['answer']
                hint = question_data.get('latex_hint', None)  # Hvis det ikke finnes noen hint, sett den til None

                cursor.execute('''
                INSERT INTO questions (category, question, answer, hint)
                VALUES (?, ?, ?, ?)
                ''', (category, question, answer, hint))
            except KeyError as e:
                print(f"Error with key {e} in data: {question_data}")

# Lagre endringene og lukk databasen
conn.commit()
conn.close()

print("Data imported successfully!")
