import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import Vuetify from '@vuetify/vite-plugin';
import Inspect from 'vite-plugin-inspect';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';

import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, './src')}/`,
    },
  },
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
      // https://vuejs.org/api/application.html#app-config-compileroptions
      // template: {
      //   compilerOptions: {
      //     isCustomElement: (tag) => ['v-simple-table'].includes(tag),
      //     // isCustomElement: (tag) => { return tag.startsWith('ion-') },
      //   },
      // },
    }),

    // https://github.com/vuetifyjs/vuetify-loader
    Vuetify({ styles: 'expose' }),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: ['vue'],
      dts: 'src/auto-imports.d.ts',
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],

      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],

      // custom resolvers
      resolvers: [
        // auto import icons
        // https://github.com/antfu/unplugin-icons
        IconsResolver({
          componentPrefix: 'i',
          enabledCollections: ['logos', 'icon-park', 'mdi'],
          alias: {
            park: 'icon-park',
          },
        }),
      ],

      dts: 'src/components.d.ts',
    }),

    // https://github.com/antfu/unplugin-icons
    Icons({
      autoInstall: false,
    }),

    // https://github.com/antfu/vite-plugin-inspect
    Inspect({
      // change this to enable inspect for debugging
      enabled: true,
    }),
  ],
  optimizeDeps: {
    include: [
      //'vue',
      //'vuetify',
      //'@vuetify/loader-shared/runtime',
      //'vuetify/lib/components/VApp/index.mjs',
      //'vuetify/lib/components/VMain/index.mjs',
      //'vuetify/lib/components/VBtn/index.mjs',
      //'vuetify/lib/components/VTextField/index.mjs',
    ],
  },
});
