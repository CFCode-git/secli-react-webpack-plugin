const chalk = require('chalk')
var slog = require('single-line-log');

class SecConsolePlugin {
  constructor(options){
    this.options = options
  }
  apply(compiler){
    /**
     * Monitor file change
     * 监听文件改动
     */
    compiler.hooks.watchRun.tap('SecConsolePlugin', (watching) => {
      const changeFiles = watching.watchFileSystem.watcher.mtimes
      for(let file in changeFiles){
        console.log(chalk.green('当前改动文件：'+ file))
      }
    })
    /**
     *  before a new compilation is created.
     *  在一次新的编译创建前
     */
    compiler.hooks.compile.tap('SecConsolePlugin',()=>{
      this.beginCompile()
    })
    /**
     * Executed when the compilation has completed.
     * 一次 compile 完成
     */
    compiler.hooks.done.tap('SecConsolePlugin',()=>{
      this.timer && clearInterval( this.timer )
      console.log( chalk.yellow(' 编译完成') )
    })
  }
  // 开始记录编译
  beginCompile(){
    const lineSlog = slog.stdout
    let text  = '开始编译：'
    this.timer = setInterval(()=>{
      text +=  '█'
      lineSlog( chalk.green(text))
    },50)
  }
}



module.exports = SecConsolePlugin
