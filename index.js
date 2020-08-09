const Koa = require('koa')
const {vuePlugin} = require('./plugin/servePluginVue')
const {serverStaticPlugin} = require('./plugin/serverPluginStatic')
const {moduleRewritePlugin} = require('./plugin/serverPluginModuleRewrite')
const {moduleResolvePlugin} = require('./plugin/serverPluginModuleResolve')
const {htmlRewritePlugin} = require('./plugin/serverPluginHtmlRewrite')
// console.log(JSON.stringify(moduleResolvePlugin),'-----------------')
function createServer(){
    const app = new Koa(); //创建实例
    // 拿到目录
    const root = process.cwd();
    const context = {
        app,
        root//当前路径
    }
    // 基于中间件
    // console.log(serverStaticPlugin,'test')
    const resolvePlugins=[
        
        htmlRewritePlugin,
        // 解析import 语法
        moduleRewritePlugin,
        
        moduleResolvePlugin,
        vuePlugin,
        // 实现静态服务的功能
        serverStaticPlugin
        

    ]//插件的集合
    resolvePlugins.forEach(plugin=>plugin(context))
    return app;
}
module.exports = createServer