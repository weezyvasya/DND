import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerZIP } from '@electron-forge/maker-zip';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    name: 'D20 Dice Roller',
    executableName: 'd20-dice-roller',
    appBundleId: 'com.d20diceroller.app',
    appCopyright: 'Copyright © 2026 Vasiliy',
    win32metadata: {
      CompanyName: 'D20 Dice Roller',
      FileDescription: 'Transparent D20 dice roller for tabletop games',
      ProductName: 'D20 Dice Roller',
      OriginalFilename: 'd20-dice-roller.exe',
    },
  },
  rebuildConfig: {},
  makers: [
    // ZIP archives for all platforms (PRIMARY - used for Steam)
    // This is the only maker we need for Steam distribution
    new MakerZIP({}, ['darwin', 'win32', 'linux']),
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new VitePlugin({
      build: [
        {
          entry: 'src/main/main.ts',
          config: 'vite.main.config.ts',
        },
        {
          entry: 'src/preload/preload.ts',
          config: 'vite.preload.config.ts',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
  ],
};

export default config;
