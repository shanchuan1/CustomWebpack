// 获取主入口文件
const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')//分析模块的主要任务是 将获取到的模块内容 解析成AST语法树
const traverse = require('@babel/traverse').default//遍历AST
const babel = require('@babel/core')//es6转es5

// 对主入口文件模块分析依赖和转化es6为es5
const getModuleInfo = (file)=>{
    const body = fs.readFileSync(file,'utf-8')
    //分析模块的主要任务是 将获取到的模块内容 解析成AST语法树
    const ast = parser.parse(body,{
        sourceType:'module' //表示我们要解析的是ES模块
    });
    // console.log(ast);
    // 不过，我们需要知道的是，当前我们解析出来的不单单是index.js文件里的内容，它也包括了文件的其他信息。 而它的内容其实是它的属性program里的body里
    // console.log(ast.program.body);

    // 收集文件的依赖关系
    const deps = {}
    traverse(ast,{
        /* 
        ImportDeclaration方法代表的是对type类型为ImportDeclaration的节点的处理。
        这里我们获得了该节点中source的value，也就是node.source.value，
        这里的value指的是什么意思呢？其实就是import的值，可以看我们的index.js的代码。
        可见，value指的就是import后面的 './add.js' 和 './minus.js'
        然后我们将file目录路径跟获得的value值拼接起来保存到deps里，美其名曰：收集依赖
        */
        ImportDeclaration({node}){
            const dirname = path.dirname(file)
            const abspath = './' + path.join(dirname,node.source.value)
            deps[node.source.value] = abspath
        }
    })
    // console.log(deps); //{ './add.js': './src\\add.js', './minus.js': './src\\minus.js' }

    // 将es6转为es5
    const {code} = babel.transformFromAst(ast,null,{
        presets:["@babel/preset-env"]
    })
    // console.log(code);

    // 返回对象包括该模块的路径（file），该模块的依赖（deps），该模块转化成es5的代码
    // return出 文件，依赖，转化后的es5代码
    const moduleInfo = {file,deps,code}
    return moduleInfo

}

// 递归获取所有依赖{file,code,deps},然后以特定的key value对象形式返回出去
const parseModules = (file) =>{
    const entry =  getModuleInfo(file)
    // console.log('entry', entry)
    const temp = [entry]
    const depsGraph = {} //新增代码
    for (let i = 0;i<temp.length;i++){
        const deps = temp[i].deps
        if (deps){
            for (const key in deps){
                if (deps.hasOwnProperty(key)){
                    temp.push(getModuleInfo(deps[key]))
                }
            }
        }
    }
    // console.log(temp)
    // 以文件的路径为key，{code，deps}为值的形式存储返回
    temp.forEach(moduleInfo=>{
    depsGraph[moduleInfo.file] = {
        deps:moduleInfo.deps,
        code:moduleInfo.code
        }
    })
    // console.log(depsGraph)
    return depsGraph
}

// 处理require函数和export对象两个浏览器不能识别执行的
// 自定义bundle处理这两个字段 生成的js代码就能使浏览器执行了
const bundle = (file) =>{
    const depsGraph = JSON.stringify(parseModules(file))
    return `(function (graph) {
        function require(file) {
            function absRequire(relPath) {
                return require(graph[file].deps[relPath])
            }
            var exports = {};
            (function (require,exports,code) {
                eval(code)
            })(absRequire,exports,graph[file].code)
            return exports
        }
        require('${file}')
    })(${depsGraph})`
    /* 
    发现其实就是将我们早期收集的所有依赖作为参数传入到立即执行函数当中，然后通过eval来递归地执行每个依赖的code。
    */
}

const content = bundle('./src/index.js')

//写入到我们的dist目录下
fs.mkdirSync('./dist');
fs.writeFileSync('./dist/bundle.js',content)

// console.log(content);
