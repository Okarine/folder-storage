const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

const baseDir = path.join(__dirname, '../public/data/SW mods 1.6.8');

function renderDirPage(dirPath, res) {
    // Reading the HTML template
    const indexFile = path.join(__dirname, 'index.html');

     // Reading the contents of the directory
    fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
        if (err) {
            return res.status(500).send('Error reading directory');
        }

        const fileList = files.map(file => ({
            name: file.name,
            path: path.join(file.name),
            isDirectory: file.isDirectory()
        }));
        // We read the HTML file and embed a variable with JSON data into it
        fs.readFile(indexFile, 'utf8', (err, htmlData) => {
            if (err) {
                return res.status(500).send('Error reading HTML file');
            }

            // Embedding JSON directly into HTML as a global variable
            const modifiedHtml = htmlData.replace(
                '<!-- FOLDER_LIST_PLACEHOLDER -->',
                `<script>const fileList = ${JSON.stringify(fileList)};</script>`
            );

            res.send(modifiedHtml);
        });
    });
}

// Route for the main page (root folder)
app.get('/', (req, res) => {
    renderDirPage(baseDir, res);
});

// Dynamic route for folders
app.get('/*', (req, res) => {
    const relativePath = req.params[0]; // Extracting the path from the route parameter
    const dirPath = path.join(baseDir, relativePath);

    // Checking if a path exists
    fs.stat(dirPath, (err, stats) => {
        if (err || !stats.isDirectory()) {
            return res.status(404).send('Directory not found');
        }

        renderDirPage(dirPath, res);
    });
})

// Static file delivery
app.use(express.static(__dirname));

// Starting the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
