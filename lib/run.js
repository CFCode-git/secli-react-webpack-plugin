// 使用 eventEmitter 作为运行 webpack 的事件模型
const EventEmitter = require('events').EventEmitter
const Server = require('webpack-dev-server/lib/Server')
const processOptions = require('webpack-dev-server/lib/utils/processOptions')
const yargs = require('yargs')
const merge = require('./merge')
const webpack = require('webpack')
const runMergeGetConfig = require('../config/webpack.base')


class RunningWebpack extends EventEmitter {

  constructor(options) {
    super()
    this._options = options
    this.basePath = null
    this.config = null
    this.on('running',(type,...arg)=>{
      this[type] && this[type](...arg)
    })
  }

  listen({type,cwdPath}){
    /*
    * 接受不同的webpack状态并合并
    * type : 主线程传递过来的 命令 start / build
    * cwdPath : 输入命令行的绝对路径
    * 接下来读取 secli.config.js 和 默认配置合并
    */
    this.basePath = cwdPath
    this.type = type
    // 合并配置项
    // 合并顺序: 先通过runMergeGetConfig type 合并 plugin 本身内置的 base + dev/pro config
    // 再将上述结果通过 merge 和 secli.config.js 合并
    this.config = merge.call(this,runMergeGetConfig(cwdPath)(type))
    return new Promise((resolve,reject)=>{
      this.emit('running',type)
      this.once('error',reject)
      this.once('end',resolve)
    })
  }

  // 运行生产环境webpack
  build(){
    try{
      webpack(this.config,error=>{
        if(error){
          this.emit('error')
        }else{
          this.emit('end')
        }
      })
    }catch(error){
      this.emit('error')
    }
  }

  // 运行开发环境webpack
  start(){
    const _this = this
    processOptions(this.config,yargs.argv,(config,options)=>{
      const compiler = webpack(config)
      const server = new Server(compiler,options)
      server.listen(options.port,options.host,error=>{
        if(error){
          _this.emit('error')
          throw error
        }
      })
    })
  }
}

module.exports = RunningWebpack
