const {readBody} = require('./utils');
// const { rewriteImports } = require('vite');
const {parse} = require('es-module-lexer')
const MagicString = require('magic-string')
function rewriteImports(content){
    
    let imports =parse(content)[0]
    let magicString = new MagicString(content) //magic
    if(imports.length){ //将imports拦截
        for(let i=0;i<imports.length;i++){
            let {s,e} = imports[i];
            let id = content.substring(s,e)
            console.log(typeof id,'typeof id------------')
            if(/^[^\/\.]/.test(id)){
                id = `/@modules/${id}`;
                magicString.overwrite(s,e,id)
            }
        }
    }
    return magicString.toString(); ///拦截
}
function moduleRewritePlugin({app,root}){
    app.use(async (ctx, next)=>{
        await next();
        // console.log(ctx.body)
        if(ctx.body&&ctx.response.is('js')){
            let content = await readBody(ctx.body)
            // console.log(content)  
            const result = rewriteImports(content)
            ctx.body = result //将内容重写并返回 
            // console.log(result,'result')
        }
    });
}
exports.moduleRewritePlugin = moduleRewritePlugin;