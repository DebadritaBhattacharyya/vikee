import { assertClientRouting } from '../../utils/assertRoutingType.js'
assertClientRouting()

import './pageFiles'
import { installClientRouter } from './installClientRouter.js'
import { onClientEntry_ClientRouting } from './utils.js'
// @ts-ignore Since dist/cjs/client/ is never used, we can ignore this error.
const isProd: boolean = import.meta.env.PROD
onClientEntry_ClientRouting(isProd)

installClientRouter()
