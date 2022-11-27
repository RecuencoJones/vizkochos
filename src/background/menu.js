const { Menu, ipcMain } = require('electron');
const { windows } = require('./windows');

const sendToAppWindow = (...data) => windows.get('appWindow').webContents.send(...data);

/** @type {Array<import('electron').MenuItemConstructorOptions | import('electron'.MenuItem>} */
const appMenu = [
  {
    role: 'fileMenu',
    submenu: [
      {
        role: 'newContext',
        label: 'New Context',
        accelerator: 'CommandOrControl+N',
        click() {
          sendToAppWindow('app-menu-relay', { command: 'file:newContext' });
        }
      },
      { type: 'separator' },
      {
        role: 'quickstart',
        label: 'Go to Quickstart',
        accelerator: 'CommandOrControl+Shift+H',
        click() {
          sendToAppWindow('app-menu-relay', { command: 'file:quickstart' });
        }
      },
      { type: 'separator' },
      {
        role: 'preferences',
        label: 'Preferences',
        accelerator: 'CommandOrControl+,',
        click() {
          sendToAppWindow('app-menu-relay', { command: 'file:preferences' });
        }
      }
    ]
  },
  { role: 'editMenu' },
  { role: 'viewMenu' },
  { role: 'windowMenu' },
  {
    role: 'helpMenu',
    label: 'Help',
    submenu: [
      {
        role: 'shortcuts',
        label: 'Shortcuts',
        accelerator: 'CommandOrControl+/',
        click() {
          sendToAppWindow('app-menu-relay', { command: 'help:shortcuts' });
        }
      },
      {
        role: 'openInGitHub',
        label: 'Open in GitHub',
        click() {
          ipcMain.emit('openGitHubRepository');
        }
      }
    ]
  }
];

if (process.platform === 'darwin') {
  appMenu.unshift({ role: 'appMenu' });
}

function setMenu() {
  Menu.setApplicationMenu(Menu.buildFromTemplate(appMenu));
}

module.exports = { setMenu };
