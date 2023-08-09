
# 加载模块
加载主入口文件的模块

# 分析模块
分析模块的主要任务是 将获取到的模块内容 解析成AST语法树，这个需要用到一个依赖包@babel/parser
npm install @babel/parser

# 收集依赖
现在我们需要 遍历AST，将用到的依赖收集起来。什么意思呢？其实就是将用import语句引入的文件路径收集起来。我们将收集起来的路径放到deps里。
前面我们提到过，遍历AST要用到@babel/traverse依赖包
npm install @babel/traverse

# ES6转成ES5（AST）
把获得的ES6的AST转化成ES5，前面讲到过，执行这一步需要两个依赖包
npm install @babel/core @babel/preset-env

# 递归获取所有依赖

# 处理两个关键字(require函数和export对象) 
因为浏览器也识别执行不了这两个关键字


# webpack打包的主要流程如下
1. 需要读到入口文件里面的内容。
2. 分析入口文件，递归的去读取模块所依赖的文件内容，生成AST语法树。
3. 根据AST语法树，生成浏览器能够运行的代码

# 具体细节
1. 获取主模块内容
2. 分析模块
    安装@babel/parser包（转AST）
3. 对模块内容进行处理
    安装@babel/traverse包（遍历AST收集依赖）
    安装@babel/core和@babel/preset-env包   （es6转ES5）
4. 递归所有模块
5. 生成最终代码

Learning Links: https://juejin.cn/post/6854573217336541192#heading-0