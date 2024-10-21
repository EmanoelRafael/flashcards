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
                reject(err); // Rejeita a promessa em caso de erro
                return;
            }

            try {
                const jsonData = JSON.parse(data);
                resolve(jsonData); // Resolve a promessa com os dados JSON
            } catch (err) {
                console.error('Erro ao analisar o JSON:', err);
                reject(err); // Rejeita a promessa em caso de erro de parsing
            }
        });
    });
}

function getDate() {
    const today = new Date();

    const day = today.getDate();
    const month = today.getMonth() + 1; // Os meses são baseados em zero, então somamos 1
    const year = today.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate
}

function orderedFlashcard(flashcard) {
    const flashcard_id = flashcard['id']
    const flashcard_create_date = flashcard['create_date']
    const flashcard_tags = flashcard['tags']
    const flashcard_front = flashcard['front']
    const flashcard_back = flashcard['back']

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

/*function validateFile(flashcardFile) {
    console.log('textsss')
    return true
}*/

// Função para validar o arquivo CSV
const validateFile = (req, res, next) => {
    const flashcardsFile = req.file;
  
    if (!flashcardsFile) {
      return res.status(400).send('Nenhum arquivo foi enviado.');
    }
  
    // Use um buffer do arquivo em memória para leitura
    const results = [];
    const expectedHeaders = ['frontCard', 'backCard']; // As colunas que queremos validar
  
    // Converte o buffer em um stream legível
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
        // Valida cada linha, se necessário
        results.push(row);
      })
      .on('end', () => {
        // O arquivo CSV está no formato correto, prossiga para a próxima função
        req.flashcardsData = results; // Armazena os dados processados para uso posterior
        next(); // Prossegue com a requisição
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

// Nova rota POST para adicionar flashcard ao JSON
app.post('/add_flashcard', async (req, res) => {
    const newFlashcard = req.body;
    
    console.log(newFlashcard)
    if (!newFlashcard.front || !newFlashcard.back) {
        return res.status(400).send('Os campos "front" e "back" são obrigatórios.');
    }

    try {
        // Lê o JSON existente
        const data = await readJSONFile(jsonFilePath);
        /*const dataa = Array.from(data);
        console.log('id do ultimo: ', dataa[-1]['id']);*/
        console.log("yeah gugudada")
        console.log(data.flashcards.slice(-1)[0]['id'])
        newFlashcard['id'] = data.flashcards.slice(-1)[0]['id'] + 1;
        newFlashcard['create_date'] = getDate();
        //newFlashcard = orderedFlashcard(newFlashcard)
        // Adiciona o novo flashcard
        data.flashcards.push(orderedFlashcard(newFlashcard));
        // Salva o JSON atualizado
        await writeJSONFile(jsonFilePath, data);

        res.status(200).send('Flashcard adicionado com sucesso!');
    } catch (error) {
        res.status(500).send('Erro ao adicionar o flashcard.');
    }
});

app.post('/upload_flashcards_file', upload.single('file'), validateFile, async (req, res) => {
    /*const flashcardsFile = req.file;
    
    console.log(flashcardsFile)
    if (!validateFile(flashcardsFile)) {
        return res.status(400).send('O arquivo não está no formato correto.');
    }
    */
    try {
        // Lê o JSON existente
        /*const data = await readJSONFile(jsonFilePath);
        const dataa = Array.from(data);
        console.log('id do ultimo: ', dataa[-1]['id']);
        console.log("yeah gugudada")
        console.log(data.flashcards.slice(-1)[0]['id'])
        newFlashcard['id'] = data.flashcards.slice(-1)[0]['id'] + 1;
        newFlashcard['create_date'] = getDate();
        //newFlashcard = orderedFlashcard(newFlashcard)
        // Adiciona o novo flashcard
        data.flashcards.push(orderedFlashcard(newFlashcard));
        // Salva o JSON atualizado
        await writeJSONFile(jsonFilePath, data); */
        const flashcards = req.flashcardsData;

        // Exemplo de processamento dos flashcards
        console.log(flashcards);
    
        res.status(200).send('Flashcards CSV validado e processado com sucesso.');
    } catch (error) {
        res.status(500).send('Erro ao adicionar o flashcard.');
    }
});

app.listen(3002, () => {
    console.log('Servidor rodando na porta 3002');
});