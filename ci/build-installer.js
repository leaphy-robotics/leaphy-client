const electronInstaller = require('electron-winstaller');
    electronInstaller.createWindowsInstaller({
      appDirectory: './leaphy_client-win32-x64',
      outputDirectory: './installers/win32',
      authors: 'Leaphy Robotics',
      exe: 'leaphy_client.exe',
      description: 'Leaphy Easybloqs Client',
      noMsi: true
    })
    .then(success => {
        console.log('It worked!');
    }, error => {
        console.log(`No dice: ${error.message}`);
    });
  