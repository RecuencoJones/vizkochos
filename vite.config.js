import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import vue from '@vitejs/plugin-vue';
import vueI18n from '@intlify/vite-plugin-vue-i18n';

export default {
  base: process.env.MODE === 'development' ? '/' : './',
  plugins: [
    vue(),
    vueI18n({
      compositionOnly: false,
      include: resolve(dirname(fileURLToPath(import.meta.url)), './src/languages/**'),
    })
  ]
};
