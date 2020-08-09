const path = require('path')
const fs = require('fs').promises
const { resolveVue } = require('./utils')
const defaultExportReg = /((?:^|\n|;)\s*)export default/
function vuePlugin({ app, root }) {
	app.use(async (ctx, next) => {
		if (!ctx.path.endsWith('.vue')) {
			return next()
		}
		//vue文件处理
		const filePath = path.join(root, ctx.path);
		const content = await fs.readFile(filePath, 'utf8')//.vue文件中的内容
		//获取文件内容
		//拿到模板编译模块进行编译
		let { parse, compileTemplate } = require(resolveVue(root).complier);//parse解析内容的，compileTemplate编辑模板的
		let { descriptor } = parse(content)//解析文件内容
		if (!ctx.query.type) {
			let code = ``
			if (descriptor.script) {//把export default变为const__script =
				let content = descriptor.script.content;
				let replaced = content.replace(defaultExportReg, '$1const __script =')
				code += replaced
			}
			if (descriptor.template) {
				const templateRequest = ctx.path + `?type=template`
				code += `\nimport { render as __render } from ${JSON.stringify(
					templateRequest
				)}`
				code += `\n__script.render = __render`
			}
			ctx.type = 'js'
			code += `\nexport default __script`
			// console.log(code)
			ctx.body = code
		}
		if (ctx.query.type == 'template') {
			ctx.type = 'js'
			let content = descriptor.template.content;
			const { code } = compileTemplate({ source: content })
			// console.log(code)
			ctx.body = code
		}
	})
}
exports.vuePlugin = vuePlugin