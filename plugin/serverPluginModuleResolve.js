const moduleREG = /^\/@modules\//;
const fs = require('fs').promises;
const path = require('path')
const {resolveVue} = require('./utils')
// const { rewriteImports } = require('vite');

function moduleResolvePlugin({app,root}){
    const vueResolved= resolveVue(root) //文件映射表
    // console.log('----------------------0')
    app.use(async (ctx,next)=>{
        // console.log('----------------1',ctx.path)
        // console.log('------------------2',!moduleREG.test(ctx.path))
        if(!moduleREG.test(ctx.path)){
            return next();
        }else{
            // console.log('99999',moduleREG)
            const id = ctx.path.replace(moduleREG,'')
            ctx.type = 'js' //设置相应类型
            console.log('-----------3',id)
            console.log(typeof id)
            console.log('-----------4',id)
            console.log(vueResolved[id],'vueResolved[id]')
            const content = await fs.readFile(vueResolved[id],'utf8')
            ctx.body = content;
        }
    })
}
// function moduleResolvePlugin({app,root}){
// 	const vueResolved = resolveVue(root)
// 	app.use(async (ctx,next) =>{
// 		if(!moduleREG.test(ctx.path)){
// 			return next()
// 		}
// 		const id = ctx.path.replace(moduleREG,'')
// 		//应该去当前项目下查找vue对应的真实文件
//         ctx.type = 'js'//设置响应类型，响应的结果是JS类型。
//         console.log(vueResolved,'vueResolved=============',id)
//         console.log(vueResolved[id],'vueResolved[id]')
//         const content = await fs.readFile(vueResolved[id],'utf8')
//         // console.log(content,'2-----00000000000')
// 		ctx.body = content
// 	})
// }
exports.moduleResolvePlugin = moduleResolvePlugin