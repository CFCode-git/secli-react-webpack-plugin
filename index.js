// 这里是子进程的入口文件, 由 secli 运行 build/start 的时候开启这里作为子进程
const RunningWebpack = require('./lib/run')

/**
 *Create a runner to run the configuration files under different environments of webpack
 * 使用 RunningWebpack 完成一系列 webpack 启动 打包操作
 * 创建 RunningWebpack 实例, 该实例继承 EventEmitter,
 * 子进程监听 message 事件, 如果 主程序传来 message,
 * 那么 RunningWebpack 实例 根据主进程传来的 cwdPath 和 type 执行 listen
 * 然后进行 config 的合并, 合并后返回一个 promise 对象
 * 触发 running 事件 / error 事件 / end 事件
 * 成功时, 通过 process.send 发送 end 给主程序
 * 失败时, process.senc 发送 error 给主程序,
 * 主程序通过 children.on('message') 监听
 */
const runner = new RunningWebpack()

process.on('message', message => {

  const msg = JSON.parse(message)
  if (msg.type && msg.cwdPath) {

    runner.listen(msg)
      .then(() => {
          // 构建完成, 通知主进程 结束子进程
          process.send(JSON.stringify({type: 'end'}))
        }, (error) => {
          // 出现错误, 通知主进程,结束子进程
          process.send(JSON.stringify({type: 'error', error}))
        }
      )
  }
})
