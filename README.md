# Meus Flashcards 

Meus Flashcards é uma aplicação que visa armazenar flashcards para posterior utilização em estudos. \
Esse armazenamento é feito utilizando tags informadas pelo usuário no momento da criação dos flashcards. \
As tags são utilizadas posteriormente para consultas.

### Criação dos Flashcards

Os flashcards podem ser criados diretamente (inserindo a parte frontal e a de trás e suas tags) \
ou por meio do upload de um arquivo contendo diversos flashcards. \
No caso de upload do arquivo, este deve ser um csv onde cada linha deve estar no formato 'front,back' \
representando a parte frontal e a traseira do respectivo flashcard. \
A primeira linha do csv deve ser: 'frontCard,backCard'. \
A ultima linha do csv deve conter as tags dos flashcards (todos os flashcards do arquivo conterão as mesmas tags): \
'Tags, Tag1-Tag2-Tag3'.

### Para executar a aplicação 
Para rodar o frontend da aplicação abra o terminal na pasta 'flashcards' e execute: 
 - npm run dev 

Para rodar o backend da aplicação abra o terminal na pasta 'server' e execute: 
 - node server.js

 ### Tecnologias utilizadas: 
 Next.js  \
 Express.js \
 tailwindcss \
 Flowbite 