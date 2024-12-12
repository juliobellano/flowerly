const { app, BrowserWindow } = require('electron');
const path = require('path');

// Create a BrowserWindow
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // Enable Node.js in the renderer process if needed
    },
  });

  // Load the URL (e.g., Express server URL)
  win.loadURL('http://localhost:3000');
};

// App lifecycle
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit(); // macOS keeps the app running unless explicitly quit
});

console.log(`App is running on electron`);
