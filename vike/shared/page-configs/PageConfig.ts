export type { PageConfigRuntime }
export type { PageConfigRuntimeLoaded }
export type { PageConfigBuildTime }
export type { ConfigEnv }
export type { ConfigEnvInternal }
export type { PageConfigGlobalRuntime }
export type { PageConfigGlobalBuildTime }
export type { ConfigValue }
export type { ConfigValues }
export type { ConfigValueSource }
export type { ConfigValueSources }
export type { ConfigValueComputed }
export type { ConfigValuesComputed }
export type { DefinedAt }
export type { DefinedAtFile }
export type { DefinedAtFileInfo }
export type { FilePathResolved }
export type { FilePath }

import type { ConfigValueImported } from './serialize/PageConfigSerialized.js'

type PageConfigBase = {
  pageId: string
  isErrorPage?: true
  routeFilesystem?: {
    routeString: string
    definedBy: string
  }
}
/** Page config data structure available and used at runtime */
type PageConfigRuntime = PageConfigBase & {
  /** Loaded config values */
  configValues: ConfigValues
  /** Load config values that are lazily loaded such as config.Page */
  loadConfigValuesAll: () => Promise<ConfigValueImported[]>
}
/** Same as PageConfigRuntime but also contains all lazily loaded config values such as config.Page */
type PageConfigRuntimeLoaded = PageConfigRuntime & {
  /** Whether loadConfigValuesAll() was called */
  isLoaded: true
}
/** Page config data structure available and used at build-time */
type PageConfigBuildTime = PageConfigBase & {
  configValues: ConfigValues
  configValueSources: ConfigValueSources
  configValuesComputed: ConfigValuesComputed
}

/** Page config that applies to all pages */
type PageConfigGlobalRuntime = {
  configValues: ConfigValues
}
type PageConfigGlobalBuildTime = {
  configValueSources: ConfigValueSources
}

type ConfigEnv = 'client-only' | 'server-only' | 'server-and-client' | 'config-only'
/** For Vike internal use */
type ConfigEnvInternal = ConfigEnv | '_routing-eager' | '_routing-lazy'
type ConfigValueSource = {
  value?: unknown
  configEnv: ConfigEnvInternal
  definedAtInfo: DefinedAtFileInfo
  /** Wether the config value is loaded at run-time, for example config.Page or config.onBeforeRender */
  valueIsImportedAtRuntime: boolean
  /** Whether the config value is a file path, for example config.client */
  valueIsFilePath?: true
}
type ConfigValueComputed = {
  configEnv: ConfigEnvInternal
  value: unknown
}
type ConfigValuesComputed = Record<
  // configName
  string,
  ConfigValueComputed
>
type ConfigValueSources = Record<
  // configName
  string,
  ConfigValueSource[]
>
type ConfigValue = {
  value: unknown
  definedAt: DefinedAt
}

type ConfigValues = Record<
  // configName
  string,
  ConfigValue
>

type DefinedAt =
  // Normal config values => defined by a unique source / file path
  | {
      file: DefinedAtFile
      // TODO: is this really needed?
      isEffect?: true
      isComputed?: undefined
      isCumulative?: undefined
    }
  // Cumulative config values => defined at multiple sources / file paths
  | {
      isCumulative: true
      files: DefinedAtFile[]
      isEffect?: undefined
      isComputed?: undefined
    }
  // Computed config values => defined internally by Vike
  | {
      isComputed: true
      isEffect?: undefined
      isCumulative?: undefined
    }

type DefinedAtFile = {
  filePathToShowToUser: string
  fileExportPath: null | string[]
}
type DefinedAtFileInfo = {
  exportName?: string
  fileExportPath: null | string[]
} & FilePath

type FilePathResolved = FilePath & { filePathAbsoluteFilesystem: string }
type FilePath = {
  /** The file's path, absolute from Vite's perspective.
   *
   * We use this to generate import paths in virtual modules (virtual modules cannot have relative import paths).
   *
   * Currently, its value is equivalent to `filePath.filePathRelativeToUserRootDir ?? filePath.importPathAbsolute`, for example:
   *   - `vike-react/config`, or
   *   - `/pages/+config.h.js`.
   */
  filePathAbsoluteVite: string
  /** The file's path relative to the filesystem root.
   *
   * Example: `/home/rom/code/my-app/pages/some-page/Page.js`
   *
   * The value is `null` upon aliased import paths which we cannot resolve (we'd need to re-implement https://www.npmjs.com/package/@rollup/plugin-alias).
   */
  filePathAbsoluteFilesystem: string | null
  /** The file's path shown to user, e.g. when logging information about the file.
   *
   * Currently, its value is equivalent to `FilePath['filePathAbsoluteVite']`.
   */
  filePathToShowToUser: string
} & (
  | {
      filePathRelativeToUserRootDir: null
      /** The file's path, as absolute import path.
       *
       * The import path is either:
       *  - an npm package import (e.g. `vike-react/config`), or
       *  - an alias (`#components/Counter').
       */
      importPathAbsolute: string
    }
  | {
      /** The file's path, relative to Vite's root (i.e. the user project's root directory).
       *
       * Example: `/pages/some-page/Page.js`
       */
      filePathRelativeToUserRootDir: string
      importPathAbsolute: null | string
    }
)
