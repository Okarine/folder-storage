const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

const baseDir = path.join(__dirname, '../public/data/SW mods 1.6.8');

app.get('/files', (req, res) => {
    const dir = path.join(baseDir, req.query.path || '');

    fs.readdir(dir, { withFileTypes: true }, (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading directory' });
        }

        // Формирование списка файлов и папок
        const fileList = files.map(file => ({
            name: file.name,
            path: path.join(req.query.path || '', file.name),
            isDirectory: file.isDirectory()
        }));

        console.log('Files in directory: ', dir, fileList);
        res.json(fileList);
    });
});

/* app.get('/', (req, res) => {
    res.send('Hello world!');
}); */

app.get('/', (req, res) => {
    res.send('Hello world! Go to <a href="/files">/files</a> to see the list of files.');
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
