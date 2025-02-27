## Folder storage project

### Changing the working repository

To use your test repository, you need to place your folder in the root folder of the project. 
Also make changes to the file `src/server.js`. In line 7, change the repository name to your own.

`const baseDir = path.join(__dirname, '../your_rep');`

### Launching the application

1. To run the project, you need to install node.js. You can do this on the official website <https://nodejs.org/en/> 
Recommended version LTS. After downloading, install via the regular installer.

2. In the terminal, check the node version

`node --version`

And also the version of the npm package manager

`npm --version`

3. If the versions are displayed correctly, then the installation was successful.
Before directly launching the project, you need to go to the root folder of the project and install the libraries used with the command

`npm i`

The root folder of the project will contain a node_modules folder with libraries and a configuration file package-lock.json

4. And we launch the project with the command

`npm start`

