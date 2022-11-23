import vue from '@vitejs/plugin-vue';

export default {
  base: process.env.MODE === 'development' ? '/' : './',
  plugins: [vue()]
};
