import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import type { UserConfig } from 'vite'

export default {
  plugins: [react(), vike()],
  resolve: {
    // Only needed for this example
    // TODO: check if still needed
    preserveSymlinks: true
  },
  // We manually add a list of dependencies to be pre-bundled, in order to avoid a page reload at dev start which breaks Vike's CI
  optimizeDeps: { include: ['react-streaming'] }
} as UserConfig
