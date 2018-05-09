Requirements:
- Git installed
- Node.js with npm installed

Instructions for setting up development environment on your machine:

1- Use Git to clone the project from GitHub. Launch "git clone https://github.com/fondazionebordoni/misurainternet-ui.git"
2- From the terminal, navigate to the cloned project root directory "misurainternet-ui"
3- Enter the command "npm install" and wait for it downloading all packages

Instructions for launch the application:
1- From the terminal, navigate to the project root directory
5- Use the command "npm start". It will open your default web browser with the page of application

note: the application will be available to any browser on you machine.
Type "localhost:3000" in the address bar to open it.

This is not a standalone application. This web app contains only the client side part of the speedtest.
This application is intendend for debugging and testing purposes only.
If you want to perform a speedtest in your local network, you can download the test server on GitHub: https://github.com/fondazionebordoni/misurainternet-speedtest
You must configure this application to use a local server. Open the file public/speedtest.js and edit lines 20 and 21.