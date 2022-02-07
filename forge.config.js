module.exports = {
  packagerConfig: {
    asar: true,
    icon: "./easybloqs-icon.ico"
  },
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        loadingGif: "./easybloqs-loading.gif",
        noMsi: true,
        iconUrl: "file://easybloqs-icon.ico",
        setupIcon: "./easybloqs-icon.ico"
      }
    },
    {
      name: '@electron-forge/maker-wix',
      config: {
        manufacturer: 'Leaphy Robotics'
      }
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: [
        "darwin",
        "linux"
      ]
    },
    {
      name: "@electron-forge/maker-dmg",
      config: {
        icon: './easybloqs-icon.ico',
        name: 'Easybloqs'
      }
    },
    {
      name: "@electron-forge/maker-deb",
      config: {
        options: {
          icon: './easybloqs-icon.ico',
          productName: 'Easybloqs'
        }
      }
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {
        options: {
          icon: './easybloqs-icon.ico',
          productName: 'Easybloqs'
        }
      }
    }
  ],
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "leaphy-robotics",
          name: "leaphy-client"
        },
        prerelease: true,
        draft: true
      }
    }
  ]
}
