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
	//vue3有几部分组成，runtime-dom,runtime-core,shared,reacctivity,compiler-sfc在后端解析.vue文件
	//编译是在后端实现的，所以需要拿到的文件是commonjs规范的
	const complierPkgPath = path.join(root,'node_modules','@vue/compiler-sfc/package.json')
	const complierPkg = require(complierPkgPath)
	const complierPath = path.join(path.dirname(complierPkgPath),complierPkg.main)
	const resolvePath = (name) => path.resolve(root,'node_modules',`@vue/${name}/dist/${name}.esm-bundler.js`)


	const runtimeDomePath = resolvePath('runtime-dom')
	const reacctivityPath = resolvePath('reactivity')
	const runtimeCorePath = resolvePath('runtime-core')
	const sharedPath = resolvePath('shared')

	//esModule
	return {
		complier:complierPath,
		'@vue/runtime-dom':runtimeDomePath,
		'@vue/runtime-core':runtimeCorePath,
		'@vue/reactivity':reacctivityPath,
		'@vue/shared':sharedPath,
		vue:runtimeDomePath
	}
}
exports.readBody = readBody
exports.resolveVue = resolveVue