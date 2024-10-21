const express = require('express');
const fs = require('fs');
const request = require('request');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const csvParser = require('csv-parser');

const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors());

app.use(express.json());

const jsonFilePath = path.join(__dirname, 'flashcards.json');

function readJSONFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Erro ao ler o arquivo:', err);
                reject(err);
                return;
            }

            try {
                const jsonData = JSON.parse(data);
                resolve(jsonData);
            } catch (err) {
                console.error('Erro ao analisar o JSON:', err);
                reject(err);
            }
        });
    });
}

function getDate() {
    const today = new Date();

    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate
}

function orderedFlashcard(flashcard) {

    const newFlashcard = {
        id: flashcard['id'],
        create_date: flashcard['create_date'],
        tags: flashcard['tags'],
        front: flashcard['front'],
        back: flashcard['back'],
    };

    return newFlashcard
}

function writeJSONFile(filePath, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Erro ao escrever no arquivo:', err);
                reject(err);
                return;
            }
            resolve();
        });
    });
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const validateFile = (req, res, next) => {
    const flashcardsFile = req.file;
  
    if (!flashcardsFile) {
      return res.status(400).send('Nenhum arquivo foi enviado.');
    }

    const results = [];
    const expectedHeaders = ['frontCard', 'backCard'];
  
    const fileStream = require('streamifier').createReadStream(flashcardsFile.buffer);
  
    fileStream
      .pipe(csvParser())
      .on('headers', (headers) => {
        const isValid = expectedHeaders.every((header) => headers.includes(header));
  
        if (!isValid) {
          return res.status(400).send('O arquivo CSV não tem o formato correto. Ele deve conter as colunas "frontCard" e "backCard".');
        }
      })
      .on('data', (row) => {
        results.push(row);
      })
      .on('end', () => {
        req.flashcardsData = results;
        next();
      })
      .on('error', (error) => {
        return res.status(500).send('Erro ao processar o arquivo CSV.');
      });
  };

app.get('/flashcards_list', async (req, res) => {

    const json_content = await readJSONFile(path.join(__dirname, 'flashcards.json'));
    console.log('Dados JSON carregados:', json_content);

    await delay(2000);
    
    res.send(json_content);
});

app.post('/add_flashcard', async (req, res) => {
    const newFlashcard = req.body;
    
    console.log(newFlashcard)
    if (!newFlashcard.front || !newFlashcard.back) {
        return res.status(400).send('Os campos "front" e "back" são obrigatórios.');
    }

    try {
        const data = await readJSONFile(jsonFilePath);
        newFlashcard['id'] = data.flashcards.slice(-1)[0]['id'] + 1;
        newFlashcard['create_date'] = getDate();
        for (let index = 0; index < newFlashcard['tags'].length; index++) {
            if (!data.tags.includes(newFlashcard['tags'][index])) {
                data.tags.push(newFlashcard['tags'][index]);
            };
        }
        data.flashcards.push(orderedFlashcard(newFlashcard));
        await writeJSONFile(jsonFilePath, data);

        res.status(200).send('Flashcard adicionado com sucesso!');
    } catch (error) {
        res.status(500).send('Erro ao adicionar o flashcard.');
    }
});

app.post('/upload_flashcards_file', upload.single('file'), validateFile, async (req, res) => {
    try {
        const flashcards = req.flashcardsData;
        const data = await readJSONFile(jsonFilePath);
        const id_aux = data.flashcards.slice(-1)[0]['id'] + 1;
        const date = getDate()
        const tags = flashcards[flashcards.length-1]['backCard'].trim().toUpperCase().split('-')
        for (let index = 0; index < flashcards.length-1; index++) {
            const newFlashcard = {}
            newFlashcard['id'] = id_aux+index;
            newFlashcard['create_date'] = date;
            newFlashcard['tags'] = tags;
            newFlashcard['front'] = flashcards[index]['frontCard']
            newFlashcard['back'] = flashcards[index]['backCard']
            data.flashcards.push(newFlashcard)
        }
        for (let index = 0; index < tags.length; index++) {
            if (!data.tags.includes(tags[index])) {
                data.tags.push(tags[index]);
            };
        }
        await writeJSONFile(jsonFilePath, data);
        res.status(200).send('Flashcards CSV validado e processado com sucesso.');
    } catch (error) {
        res.status(500).send('Erro ao adicionar o flashcard.');
        console.log(error)
    }
});

app.listen(3002, () => {
    console.log('Servidor rodando na porta 3002');
});