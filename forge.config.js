module.exports = {
  "packagerConfig": {
    "asar": true,
    "icon": "./easybloqs-icon.ico"
  },
  "makers": [
    {
      "name": "@electron-forge/maker-squirrel",
      "config": {
        "setupExe": "EasyBloqsSetup.exe",
        "loadingGif": "./easybloqs-loading.gif",
        "noMsi": true,
        "iconUrl": "file://easybloqs-icon.ico",
        "setupIcon": "./easybloqs-icon.ico",
        "certificateFile": "./self-signed-cert.pfx",
        "certificatePassword": process.env['CERTIFICATE_PASSWORD']
      }
    },
    {
      "name": "@electron-forge/maker-zip",
      "platforms": [
        "darwin",
        "linux"
      ]
    },
    {
      "name": "@electron-forge/maker-dmg",
      "config": {
        "iconUrl": "file://easybloqs-icon.ico"
      }
    },
    {
      "name": "@electron-forge/maker-deb",
      "config": {}
    },
    {
      "name": "@electron-forge/maker-rpm",
      "config": {}
    }
  ],
  "publishers": [
    {
      "name": "@electron-forge/publisher-github",
      "config": {
        "repository": {
          "owner": "leaphy-robotics",
          "name": "leaphy-client"
        },
        "prerelease": true,
        "draft": true
      }
    }
  ]
}
