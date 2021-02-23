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
        setupIcon: "./easybloqs-icon.ico",
        certificateFile: process.env['WINDOWS_CODESIGN_CERTIFICATE'],
        certificatePassword: process.env['WINDOWS_CODESIGN_PASSWORD']
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
        iconUrl: "file://easybloqs-icon.ico"
      }
    },
    {
      name: "@electron-forge/maker-deb",
      config: {}
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
      platforms: process.env['TARGET_ARCH'] == "arm64" ? [] : ["linux"],
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
