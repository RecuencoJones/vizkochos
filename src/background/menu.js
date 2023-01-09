const { Menu, ipcMain } = require('electron');
const { instances } = require('./instances');
const { viewLogs } = require('./logger');
const { getDB } = require('./services/db');

const sendToAppWindow = (...data) => instances.get('appWindow').webContents.send(...data);

async function createAppMenuTemplate() {
  const db = await getDB();
  const i18n = instances.get('i18n');
  const pinned = db.pinned;

  /** @type {Array<import('electron').MenuItemConstructorOptions | import('electron'.MenuItem>} */
  const appMenu = [
    {
      role: 'fileMenu',
      submenu: [
        {
          role: 'newContext',
          label: i18n.t('menu.file.newcontext'),
          accelerator: 'CommandOrControl+N',
          click() {
            sendToAppWindow('app-menu-relay', { command: 'file:newContext' });
          }
        },
        { type: 'separator' },
        {
          role: 'quickstart',
          label: 'Go to Quickstart',
          label: i18n.t('menu.file.quickstart'),
          accelerator: 'CommandOrControl+1',
          click() {
            sendToAppWindow('app-menu-relay', { command: 'file:quickstart' });
          }
        },
        {
          role: 'contexts',
          label: i18n.t('menu.file.contexts'),
          accelerator: 'CommandOrControl+2',
          click() {
            sendToAppWindow('app-menu-relay', { command: 'file:contexts' });
          }
        },
        { type: 'separator' },
        {
          role: 'pinned',
          label: i18n.t('menu.file.pinned'),
          submenu: pinned?.length
            ? pinned.map((pin, index) => ({
              label: pin.name,
              accelerator: 'Alt+' + (index + 1),
              click() {
                sendToAppWindow('app-menu-relay', { command: 'file:pinned', data: pin });
              }
            }))
            : [{ label: i18n.t('menu.file.empty'), enabled: false }]
        },
        { type: 'separator' },
        {
          role: 'preferences',
          label: i18n.t('menu.file.preferences'),
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
          label: i18n.t('menu.help.shortcuts'),
          accelerator: 'CommandOrControl+/',
          click() {
            sendToAppWindow('app-menu-relay', { command: 'help:shortcuts' });
          }
        },
        {
          role: 'logs',
          label: i18n.t('menu.help.viewlogs'),
          accelerator: 'CommandOrControl+Shift+L',
          click() {
            viewLogs();
          }
        },
        {
          role: 'openInGitHub',
          label: i18n.t('menu.help.openingithub'),
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

  return appMenu;
}

async function setMenu() {
  const menuTemplate = await createAppMenuTemplate();

  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
}

module.exports = { setMenu };
