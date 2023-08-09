


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

# 处理两个关键字(require函数和export对象) 因为浏览器也识别执行不了这两个关键字