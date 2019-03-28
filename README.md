# 基于webpack4.x项目实战2 - 配置一次，多个项目运行

不久前，写过一篇webpack4的简单实践，传送门： (基于webpack4.x项目实战)[https://juejin.im/post/5c7a9f27f265da2dca387dc9]，今天我们继续来webpack4.x的实战第二部分，只需要配置一次，就可以多个项目一起使用。

使用场景：
1. 我们自己公司的项目，非外包项目.
2. 我们的项目都使用vue或者react，统一一个框架，本文基于vue
3. 我们不想每次开发一个项目都复制粘贴一个webpack配置，而且希望只配置一次，每个项目都可以通用
4. 我们可以引用公共项目的代码，所有项目共享。
5. 可以自定义个别项目的webpack配置，灵活配置


我们的目录结构如下：
├到时用tree生成



# webpack-multi
一个只需要配置一次，多个项目共同使用的基于webpack的前端自动化工具

目标:
  
  1. 配置一次，可多个项目配合使用，可以自定义端口、mock、less、rem、自定义该项目的webpack
  
  2. 支持应用公共组件、引用路径先本地，再common

  3. 基于webpack4

https://github.com/zhouyupeng/vue-mock/tree/master/build   一个简单的vue-cli参考

http://blog.gejiawen.com/2016/09/21/make-a-node-cli-program-by-commander-js/

https://segmentfault.com/a/1190000008779053

