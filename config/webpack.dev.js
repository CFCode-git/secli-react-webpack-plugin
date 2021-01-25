const webpack = require('webpack')
const path = require('path')

const RuxConsolePlugin = require('../plugins/sec-console-plugin')

const devConfig = (basePath) => {
  return {
    devtool:'cheap-module-eval-source-map',
    mode:'development',
    devServer:{
      contentBase:path.resolve(basePath,'dist'),
      open:true, // 自动打开浏览器
      hot:true,
      historyApiFallback:true,
      publicPath:'/',
      port:8888,
      inline:true,
      proxy:{
        // 代理服务器
      }
    },
   plugins:[
     new webpack.HotModuleReplacementPlugin(),
     new RuxConsolePlugin({
       dec:1
     })
   ]
  }
}

module.exports = devConfig
