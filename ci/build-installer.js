const electronInstaller = require('electron-winstaller');
    electronInstaller.createWindowsInstaller({
      appDirectory: '/tmp/leaphy-client-win32-x64',
      outputDirectory: '/tmp/installer64',
      authors: 'Leapy Robotics',
      exe: 'leaphy-client.exe',
      description: 'Leaphy Robocoder Client'
    })
    .then(success => {
        console.log('It worked!');
    }, error => {
        console.log(`No dice: ${error.message}`);
    });
  