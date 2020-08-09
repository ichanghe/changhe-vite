const static = require('koa-static')
const path = require('path')
function serverStaticPlugin({app,root}){
    // console.log(root,'root')
    app.use(static(root))
    app.use(static(path.join(root,'public')));
}
exports.serverStaticPlugin = serverStaticPlugin;
