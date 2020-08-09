const {Readable} = require('stream')
const path = require('path')
async function readBody(stream){
    if(stream instanceof Readable){
        return new Promise((resolve,reject)=>{
        let res = ''
        stream.on('data',data=>{
            res+=data
        })
        stream.on('end',()=>{
            resolve(res) //将内容解析完成
        })
    })
    }else{
        return stream.toString()
    }
    
}
function resolveVue(root){
    //vue3 组成部分 runtime-dom runtime-core compiler reactivity shared
    //compiler-sfc 在后端中解析.vue文件



    //编译是在后端实现，所以拿到的是common.js规范的
    const complierPkgPath = path.join(root,'node_modules','@vue/compiler-sfc/package.json')
    const compilerPkg = require(complierPkgPath); //获取到内容
    const compilerPath = path.join(path.dirname(complierPkgPath),compilerPkg.main)
    // console.log(compilerPath, 'pppppkkkkkkkggggg');
    const resolvePath = (name)=>{
        let dealResult = path.resolve(root,'node_modules',`@vue/${name}/dist/${name}.esm-bundler.js`)
    //   console.log(dealResult, 'dealresult')
        return dealResult
    }
    const runtimeDomPath = resolvePath('runtime-dom')
    const runtimeCorePath = resolvePath('runtime-core')
    const reactivityPath = resolvePath('reactivity')
    const sharedPath = resolvePath('shared')
    
    // console.log()
    let obj = { 
        compiler:compilerPath,
        '@vue/runtime-dom':runtimeDomPath,
        '@vue/runtime-core':runtimeCorePath,
        '@vue/reactivity':reactivityPath,
        '@vue/shared' :sharedPath,
        vue:runtimeDomPath
    }
    // console.log(obj,'----------10')
    return obj
}
exports.readBody = readBody
exports.resolveVue = resolveVue;