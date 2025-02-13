const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

const baseDir = path.join(__dirname, '../public/data/SW mods 1.6.8');

// Маршрут для отображения главной страницы и передачи списка папок
app.get('/', (req, res) => {
    // Читаем HTML-шаблон
    const indexFile = path.join(__dirname, 'index.html');
    
    // Читаем содержимое директории
    fs.readdir(baseDir, { withFileTypes: true }, (err, files) => {
        if (err) {
            return res.status(500).send('Error reading directory');
        }

        const fileList = files.map(file => ({
            name: file.name,
            path: path.join(req.query.path || '', file.name),
            isDirectory: file.isDirectory()
        }));

        // Читаем HTML-файл и встраиваем туда переменную с JSON-данными
        fs.readFile(indexFile, 'utf8', (err, htmlData) => {
            if (err) {
                return res.status(500).send('Error reading HTML file');
            }

            // Встраиваем JSON прямо в HTML как глобальную переменную
            const modifiedHtml = htmlData.replace(
                '<!-- FOLDER_LIST_PLACEHOLDER -->',
                `<script>const fileList = ${JSON.stringify(fileList)};</script>`
            );

            res.send(modifiedHtml);
        });
    });
});

// Статическая отдача файлов (если нужно для других файлов, например стилей)
app.use(express.static(__dirname));

// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
