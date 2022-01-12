import {Plugin, ResolvedConfig} from 'vite'
import {getImportObjInfo} from "./parser";
import {readFileSync} from "fs";

type PluginOptions = {
  [name: string]: any
}

export default (options: PluginOptions = {}): Plugin => {
  const checkLoadResult = (loadRes: any) => {
    return (
      typeof loadRes === 'string' && loadRes.includes('import initWasm from ')
    )
  }

  const overwriteResult = (id: string, loadRes: string) => {
    const binary = readFileSync(id)
    const info = getImportObjInfo(binary)
    console.log(info)
    let imports = 'let imports = {}\n'
    let importStr = ''
    for (let fileName of info.keys()) {
      // @ts-ignore
      const obj = info.get(fileName).join(', ')
      importStr += `import { ${obj} } from '${fileName}'\n`
      imports += `imports['${fileName}'] = { ${obj} }\n`
    }

    const str1 = loadRes.replace('export default', 'const init =')
    const str2 = importStr + imports
    const str3 = `
const exports = await init(imports)
export default exports
`
    console.log(str1 + str2 + str3)
    return str1 + str2 + str3
  }

  return {
    name: 'vite:load-wasm',

    configResolved(config: ResolvedConfig) {
      // find and check original vite:wasm plugin and its load function
      const wasmPlugin = config.plugins.find(p => p.name === 'vite:wasm')
      if (!wasmPlugin || !wasmPlugin.load) {
        return
      }

      // original vite:wasm load function
      const orgLoad = wasmPlugin.load
      // overwrite
      wasmPlugin.load = async function (id) {
        const loadRes = await orgLoad.apply(this, [id])
        if (!checkLoadResult(loadRes)) {
          return loadRes
        }
        return overwriteResult(id, loadRes as string)
      }
    },
  }
}
