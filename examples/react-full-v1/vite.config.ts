import react from '@vitejs/plugin-react-swc'
import mdx from '@mdx-js/rollup'
import vike from 'vike/plugin'
import { UserConfig } from 'vite'

export default {
  plugins: [
    vike({
      prerender: {
        partial: true // LA_TEMP
      }
    }),
    mdx(),
    react()
  ]
} as UserConfig
