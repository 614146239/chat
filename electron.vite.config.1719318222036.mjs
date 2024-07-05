// electron.vite.config.ts
import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import vue from "@vitejs/plugin-vue";
import { mediapipe } from "vite-plugin-mediapipe";
var __electron_vite_injected_dirname = "D:\\\u684C\u9762\u6587\u4EF6\\go\\\u4EFFqq\u8F6F\u4EF6\\qq";
var electron_vite_config_default = defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve(__electron_vite_injected_dirname, "./src/renderer/src")
      }
    },
    plugins: [
      // 兼容底浏览器
      vue(),
      mediapipe({
        "face_mesh.js": ["FaceMesh"],
        "selfie_segmentation.js": ["SelfieSegmentation"]
      }),
      AutoImport({
        include: [
          /\.[tj]sx?$/,
          // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/
          // .vue
        ],
        resolvers: [ElementPlusResolver()],
        // 自动引入
        imports: ["vue", "pinia"]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      })
    ],
    server: {
      // proxy: {
      //   '/api': {
      //     target: 'http://localhost:8080',
      //     changeOrigin: true,
      //     ws: true
      //   }
      // }
    }
  }
});
export {
  electron_vite_config_default as default
};
