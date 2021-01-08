const electronInstaller = require('electron-winstaller');
    electronInstaller.createWindowsInstaller({
      appDirectory: './easybloqs-win32-x64',
      outputDirectory: './installers/win32',
      authors: 'Leaphy Robotics',
      exe: 'easybloqs.exe',
      description: 'Leaphy Easybloqs',
      noMsi: true,
      iconUrl: 'file://easybloqs-icon.ico',
      setupIcon: './easybloqs-icon.ico',
      setupExe: 'EasybloqsSetup.exe',
      loadingGif: './easybloqs-loading.gif'
    })
    .then(success => {
        console.log('It worked!');
    }, error => {
        console.log(`No dice: ${error.message}`);
    });
