// 合并webpack配置项
const fs = require('fs')
const merge = require('webpack-merge')
const path = require('path')

// 合并配置
function configMerge(Pconf, config) {
  const {
    dev = Object.create(null),
    pro = Object.create(null),
    base = Object.create(null)
  } = Pconf
  if (this.type === 'start') {
    return merge(config, base, dev)
  } else {
    return merge(config, base, pro)
  }
}


// config : 经过 runMergeGetConfig 得到的脚手架基本配置
function mergeConfig(config) {
  const targetPath = path.resolve(this.basePath, 'secli.config.js')
  const isExist = fs.existsSync(targetPath)
  if (isExist) {
    // 获取开发者自定义配置
    const perConfig = require(targetPath)
    return configMerge.call(this, perConfig, config)
  }
  // 返回最终打包的 webpack 配置项
  return config
}

module.exports = mergeConfig

