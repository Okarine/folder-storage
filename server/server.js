const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

const baseDir = path.join(__dirname, '../data'); //'../your_rep'

function renderDirectory(dirPath, res) {
    // Reading the HTML template
    const indexFile = path.join(__dirname, '../index.html');

     // Reading the contents of the directory
    fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
        if (err) {
            return res.status(500).send('Error reading directory');
        }

        const fileList = files.map(file => {
            const filePath = path.join(dirPath, file.name);
            const stats = fs.statSync(filePath);

            return {
                name: file.name,
                path: path.join(file.name),
                isDirectory: file.isDirectory(),
                size: file.isDirectory() ? null : stats.size,
                lastModified: stats.mtime
            }
        });

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

app.use(express.static('public'));

// Route for the main page (root folder)
app.get('/', (req, res) => {
    renderDirectory(baseDir, res);
});

// Dynamic route for folders
app.get('/*', (req, res) => {
    const relativePath = req.params[0]; // Extracting the path from the route parameter
    const dirPath = path.join(baseDir, relativePath);

    fs.stat(dirPath, (err, stats) => {
        // Checking is folder or file exists
        if(err) {
            return res.status(404).send('Directory or file not found');
        }

        // If it's folder, display content
        if (stats.isDirectory()) {
            renderDirectory(dirPath, res);
        } else { 
            // Download if it's file
            res.download(dirPath, err => {
                if(err) {
                    res.status(500).send('Error downloading file');
                }
            })
        }
    });
})


// Starting the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
