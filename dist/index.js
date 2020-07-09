#!/usr/bin/env node
!function(){const e=require("path"),{program:o}=require("commander"),{spawn:i,spawnSync:n}=require("child_process");if(o.option("--create","创建模板").option("--build <type>","build").option("--plugin","插件模式").option("--type <type>","解耦包类型(哪种小程序)","weixin").option("--native","原生模式"),o.parse(process.argv),o.create){const o=require("fs-extra"),i=process.cwd(),a=require(e.resolve(i,"package.json")),p=require("./template/package.json"),c=require("./template/projectToSubPackageConfig");a.scripts={...p.scripts,...a.scripts||{}},a.dependencies={...p.dependencies,...a.dependencies||{}},o.copySync(e.resolve(__dirname,"template/projectToSubPackageConfig.js"),e.resolve(i,"projectToSubPackageConfig.js")),console.log("projectToSubPackageConfig植入成功"),o.writeJsonSync(e.resolve(i,"package.json"),a,{spaces:2}),console.log("package.json更新成功"),c.mainWeixinMpPath&&(o.mkdirsSync(e.resolve(i,c.mainWeixinMpPath)),console.log("projectToSubPackageConfig.mainWeixinMpPath创建成功")),c.mainToutiaoMpPath&&(o.mkdirsSync(e.resolve(i,c.mainToutiaoMpPath)),console.log("projectToSubPackageConfig.mainToutiaoMpPath创建成功")),c.mainAlipayMpPath&&(o.mkdirsSync(e.resolve(i,c.mainAlipayMpPath)),console.log("projectToSubPackageConfig.mainAlipayMpPath创建成功"));n("win32"===process.platform?"npm.cmd":"npm",["install","concurrently","cross-env","uniapp2wxpack","-S"],{cwd:process.cwd(),stdio:"inherit"});return}let a={development:"startToPackServe",production:"mpWxSubMode"};a[o.build]?i(process.execPath,[require.resolve("gulp/bin/gulp.js"),a[o.build],"--scope",process.cwd(),...o.plugin?["--plugin"]:[],...o.native?["--native"]:[],"--type",o.type],{cwd:__dirname,stdio:"inherit"}):console.log("缺少参数\n--create\n--build [development/production]")}();