"use strict";function e(e){return e&&"object"==typeof e&&"default"in e?e.default:e}var t=e(require("del")),n=e(require("gulp")),r=e(require("path")),a=e(require("commander")),s=e(require("single-line-log")),p=e(require("gulp-load-plugins")),i=e(require("vue-template-compiler")),o=e(require("preprocess")),c=e(require("fs-extra")),l=e(require("strip-json-comments")),u=e(require("gulp-strip-comments"));const{program:g}=a;g.option("--scope <type>","运行目录",process.cwd()).option("--plugin","插件模式").option("--type <type>","解耦包类型(哪种小程序)","weixin").option("--native","原生模式"),g.parse(process.argv);const f={weixin:{html:"wxml",css:"wxss",globalObject:"wx",mainMpPath:"mainWeixinMpPath",directivePrefix:"wx:",projectConfig:"project.config.json"},baidu:{html:"swan",css:"css",globalObject:"swan",mainMpPath:"mainBaiduMpPath",directivePrefix:"s-",projectConfig:"project.swan.json"},toutiao:{html:"ttml",css:"ttss",globalObject:"tt",mainMpPath:"mainToutiaoMpPath",directivePrefix:"tt:",projectConfig:"project.config.json"},alipay:{html:"axml",css:"acss",globalObject:"my",mainMpPath:"mainAlipayMpPath",directivePrefix:"a:",projectConfig:"mini.project.json"}},h=f[g.type];if(!h)throw Error("小程序类型错");process.env.PACK_TYPE=g.type;const m=g.scope,d=function(){return require.apply(null,arguments)}(r.resolve(m,"./projectToSubPackageConfig")),P=d.sourceCodePath||"src",y=d.wxResourcePath||`${P}/${h.globalObject}resource`,b=d.wxResourceAlias||"@wxResource",v=RegExp(b+"\\/","g"),w=d.uniRequireApiName||"__uniRequireWx",j=RegExp(w+"\\(([a-zA-Z.\\/\"'@\\d-_]+)\\)","g"),k=d.uniImportWxssApiName||"__uniWxss",x=RegExp(`(}|^|\\s|;)${k}\\s*{([^{}]+)}`,"g"),$=d.projectConfigPath||"";let S="dev";"production"===process.env.NODE_ENV&&(S="build");const O="dist/"+S+"/mp-"+g.type;let _="dist/"+S+`/mp-${g.type}-pack`;g.plugin&&(_="dist/"+S+`/mp-${g.type}-pack-plugin`);var E={pluginProcessFileTypes:d.pluginProcessFileTypes||["js","json","wxml","ttml","ttss","swan","css","html","wxss","htm","wxs","sjs","acss","axml"],currentNamespace:h,program:g,cwd:m,projectToSubPackageConfig:d,wxResourcePath:y,wxResourceAlias:b,regExpWxResources:v,uniRequireApiName:w,regExpUniRequire:j,uniImportWxssApiName:k,regExpUniImportWxss:x,configWxResourceKey:d.configWxResourceKey||"wxResource",env:S,base:O,target:_,basePath:r.resolve(m,O),subModePath:r.resolve(m,_,d.subPackagePath),targetPath:r.resolve(m,_),packIsSubpackage:{mode:!1},mpTypeNamespace:f,sourceCodePath:P,projectConfigPath:$};let A;const C=s.stdout;var N={tryAgain:async function(e){return new Promise(async t=>{setTimeout(async()=>{t(await e())},100)})},getLevelPath:function(e){return Array(e).fill("../").join("")},getLevel:function(e){return e.split(/[\\/]/).length-1},writeLastLine:function(e){C(e),clearTimeout(A),A=setTimeout(()=>{C("解耦构建，正在监听中......(此过程如果出现权限问题，请使用管理员权限运行)")},300)},deepFind:function e(t,n,r,a){n&&(n(t,r,a),t.childNodes?t.childNodes.forEach((t,r,a)=>{e(t,n,r,a)}):t.children&&t.children.forEach((t,r,a)=>{e(t,n,r,a)}))}};const{basePath:R}=E,{tryAgain:M}=N;n.task("clean:base",(async function e(n){try{await t([R+"/**/*"],{force:!0})}catch(t){return void await M(async()=>{await e(n)})}n()}));const{subModePath:T}=E,{tryAgain:L}=N;n.task("clean:subModePath",(async function e(n){try{await t([T+"/**/*"],{force:!0})}catch(t){return void await L(async()=>{await e(n)})}n()}));const{targetPath:B}=E,{tryAgain:q}=N;n.task("clean:previewDist",(async function e(n){try{await t([B+"/**/*"],{force:!0})}catch(t){return void await q(async()=>{await e(n)})}n()}));const{compile:F}=i;var J=class{constructor(e){this.topNode={children:[]},this.init(e)}init(e){this.topNode=F(`<div>${e}</div>`).ast}getAttr(e,t){return e.attrsMap&&e.attrsMap[t]||""}setAttr(e,t,n){if(!e.attrsMap)return"";e.attrsMap[t]=n}render(e=this.topNode.children,t=""){return e.reduce((e,t)=>{if(t.removed)return e;if(1===t.type&&!t.tag)return e;if(3===t.type||2===t.type)return e+=this.writeText(t);const{tag:n,attrsMap:r,children:a=[]}=t;return e+=this.writeOpenTag(n,r),e+=this.render(a),e+=this.writeCloseTag(n)},t)}writeOpenTag(e,t){if(t){const n=Object.keys(t).map(e=>t[e].indexOf('"')>-1&&0>t[e].indexOf("'")?`${e}='${t[e]}'`:`${e}="${t[e]}"`);return`<${e}${n.length>0?" "+n.join(" "):""}>`}return`<${e}>`}writeText(e){return e.text}writeCloseTag(e){return`</${e}>`}};const{currentNamespace:W,mpTypeNamespace:I}=E,{deepFind:U}=N,K=Object.keys(I).map(e=>I[e].directivePrefix),D=Object.keys(I).map(e=>I[e].html),H=RegExp(`^(${K.join("|")})`),Y=RegExp(`\\.(${D.join("|")})$`,"i");var z=function(e,t){if(t.relative.match(Y)){const t=new J(e);return U(t.topNode,e=>{if(!e.tag||3===e.type)return;const n=t.getAttr(e,"class");"toutiao"===process.env.PACK_TYPE&&n&&!n.match(/(^\s|(\s$))/)&&t.setAttr(e,"class",n+" ");const r=t.getAttr(e,"catchTap");"toutiao"===process.env.PACK_TYPE&&r&&!t.getAttr(e,"bindTap")&&t.setAttr(e,"bindTap",r);const a=t.getAttr(e,"src");e.tag.match(/^(include|import)$/)&&a&&t.setAttr(e,"src",a.replace(Y,"."+W.html)),e.attrsMap&&Object.keys(e.attrsMap).forEach(t=>{if(t.match(H)){const n=t.replace(H,W.directivePrefix);e.attrsMap[n]=e.attrsMap[t],n!==t&&delete e.attrsMap[t]}})}),t.render()}return e};const{currentNamespace:V,mpTypeNamespace:Z}=E,G=Object.keys(Z).map(e=>Z[e].css),Q=RegExp(`\\.(${G.join("|")})$`,"i");var X=function(e,{relative:t}){return t.match(Q)&&(e=e.replace(/@import\s*['"](\S+)['"]/g,(function(e,t){return`@import '${t.replace(Q,"."+V.css)}'`}))),e};var ee=function(e,{relative:t}){return"toutiao"===process.env.PACK_TYPE&&t.match(/^\/app\.js$/i)?"\nif (!Promise.prototype.finally) {\n    Promise.prototype.finally = function (callback) {\n        let P = this.constructor;\n        return this.then(\n            value  => P.resolve(callback()).then(() => value),\n            reason => P.resolve(callback()).then(() => { throw reason })\n        );\n    };\n}\n;\n"+e:e};const{preprocess:te}=o;var ne=function(e,{relative:t}){if(t.match(/\.js$/i))try{return te(e,process.env,{type:"js"})}catch(t){return console.log("js条件编译出错"),console.log(t),e}return e};const{currentNamespace:re}=E,{preprocess:ae}=o;var se=function(e,{relative:t}){if(t.match(RegExp(`.${re.css}$`,"i")))try{return ae(e,process.env,{type:"css"})}catch(t){return console.log(re.css+"条件编译出错"),console.log(t),e}return e};const{currentNamespace:pe}=E,{preprocess:ie}=o;var oe=function(e,{relative:t}){if(t.match(RegExp(`.${pe.html}$`,"i")))try{return ie(e,process.env,{type:"html"})}catch(t){return console.log(pe.html+"条件编译出错"),console.log(t),e}return e};const{mpTypeNamespace:ce,currentNamespace:le}=E,ue=(process,new Set(Object.keys(ce).map(e=>ce[e].globalObject)));var ge={mixinsEnvCode:function(e){let t="";return ue.forEach(e=>{le.globalObject!==e&&(t+=`var ${e} = ${le.globalObject};\n`)}),t}};const{mixinsEnvCode:fe}=ge;var he={htmlMixinPlugin:z,cssMixinPlugin:X,polyfillPlugin:ee,jsPreProcessPlugin:ne,cssPreProcessPlugin:se,htmlPreProcessPlugin:oe,jsMixinPlugin:function(e,{relative:t}){return t.match(/\.js$/i)?fe()+e:e}};const{projectToSubPackageConfig:me,targetPath:de}=E;(!me.plugins||!me.plugins instanceof Array)&&(me.plugins=[]);var Pe={runPlugins:function(e){return function(t){const{plugins:n}=me;if(!n||!n instanceof Array)return;const a=r.resolve(e,this.file.relative),s={relative:a.replace(RegExp("^"+de.replace(/\\/g,"\\\\")),"").replace(/\\/g,"/"),absolute:a};return n.reduce((e,t)=>{if("string"==typeof t&&(t=he[t]),"function"!=typeof t)return e;const n=t.call(this,e,s,he);return null==n?e:n},t)}}};const ye=p(),{cwd:be,projectToSubPackageConfig:ve,target:we,env:je,pluginProcessFileTypes:ke,sourceCodePath:xe}=E,{writeLastLine:$e}=N,{runPlugins:Se}=Pe;n.task("watch:pluginJson",(function(){const e=ye.filter(ke.map(e=>"**/*."+e),{restore:!0});return n.src(xe+"/plugin.json",{allowEmpty:!0,cwd:be}).pipe(ye.if("dev"===je,ye.watch(xe+"/plugin.json",{cwd:be},(function(e){$e("处理"+e.relative+"......")})))).pipe(e).pipe(ye.replace(/[\s\S]*/,Se(r.resolve(be,we+"/"+ve.subPackagePath)),{skipBinary:!1})).pipe(e.restore).pipe(n.dest(we+"/"+ve.subPackagePath,{cwd:be}))}));const Oe=p(),{cwd:_e,target:Ee,env:Ae,targetPath:Ce,pluginProcessFileTypes:Ne,currentNamespace:Re,projectConfigPath:Me}=E,{writeLastLine:Te}=N,{runPlugins:Le}=Pe;n.task("watch:projectConfigJson",(function(){const e=Oe.filter(Ne.map(e=>"**/*."+e),{restore:!0});return n.src(`${Me?Me+"/":""}${Re.projectConfig}`,{allowEmpty:!0,cwd:_e}).pipe(Oe.if("dev"===Ae,Oe.watch(`${Me?Me+"/":""}${Re.projectConfig}`,{cwd:_e},(function(e){Te("处理"+e.relative+"......")})))).pipe(e).pipe(Oe.replace(/[\s\S]*/,Le(Ce),{skipBinary:!1})).pipe(e.restore).pipe(n.dest(Ee,{cwd:_e}))}));const{program:Be,cwd:qe,projectToSubPackageConfig:Fe,basePath:Je,subModePath:We,targetPath:Ie,packIsSubpackage:Ue,currentNamespace:Ke}=E;var De=function(){if(Be.plugin)return;const e=r.resolve(qe,Fe[Ke.mainMpPath]+"/app.js");if(c.existsSync(e)){const t=c.readFileSync(e,"utf8");let n=`require('${`./${Fe.subPackagePath}/`}app.js');\n`;if(We===Ie){n=c.readFileSync(Je+"/app.js","utf8")+";\n"}(Ue.mode||Be.plugin)&&(n=""),c.outputFileSync(Ie+"/app.js",n+t)}};const He=p(),{program:Ye,cwd:ze,projectToSubPackageConfig:Ve,configWxResourceKey:Ze,base:Ge,packIsSubpackage:Qe,currentNamespace:Xe,sourceCodePath:et}=E,{writeLastLine:tt}=N;var nt=function(e){return tt("处理app.json......"),He.replace(/[\s\S]+/,(function(t){if(Ye.plugin&&"mainAppJson"===e)return t;Qe.mode=!1;let n,a,s,p={};({pagesJson(){try{n=JSON.parse(l(t))}catch(e){n={}}},baseAppJson(){try{a=JSON.parse(t)}catch(e){a={}}},mainAppJson(){try{s=JSON.parse(t)}catch(e){s={}}}})[e]();try{n||(n=JSON.parse(l(c.readFileSync(r.resolve(ze,et+"/pages.json"),"utf8"))))}catch(e){n={}}try{a||(a=JSON.parse(c.readFileSync(r.resolve(ze,Ge+"/app.json"),"utf8")))}catch(e){a={}}try{s||(s=JSON.parse(c.readFileSync(r.resolve(ze,Ve[Xe.mainMpPath]+"/app.json"),"utf8")))}catch(e){s={}}function i(e){return Ve.subPackagePath+(Ve.subPackagePath?"/":"")+e}if(s.subPackages){let e=s.subPackages.find(e=>e.root===Ve.subPackagePath);if(e){Qe.mode=!0;let t=[...n[Ze]&&n[Ze].pages||[],...a.pages||[]];return a.subPackages&&a.subPackages.forEach(e=>{t=[...t,...(e.pages||[]).map(t=>e.root+(e.root?"/":"")+t)]}),n[Ze]&&n[Ze].subPackages&&n[Ze].subPackages.forEach(e=>{t=[...t,...(e.pages||[]).map(t=>e.root+(e.root?"/":"")+t)]}),e.pages=t,De(),delete a.pages,delete a.subPackages,JSON.stringify({...a,...s},null,2)}}a.pages&&a.pages.forEach((e,t)=>{a.pages[t]=i(e)}),a.subPackages&&a.subPackages.forEach(e=>{e.root=i(e.root)}),n[Ze]&&(n[Ze].pages&&n[Ze].pages.forEach((e,t)=>{n[Ze].pages[t]=i(e)}),n[Ze].subPackages&&n[Ze].subPackages.forEach(e=>{e.root=i(e.root)})),a.tabBar&&a.tabBar.list&&a.tabBar.list.forEach(({pagePath:e,iconPath:t,selectedIconPath:n,...r},s)=>{a.tabBar.list[s]={pagePath:e?i(e):"",iconPath:t?i(t):"",selectedIconPath:n?i(n):"",...r}}),p={...a,...s},p.pages=Array.from(new Set([...n.indexPage?[i(n.indexPage)]:[],...s.pages||[],...a.pages||[],...n[Ze]&&n[Ze].pages||[]]));let o=[],u={};function g(e){e.forEach(e=>{u[e.root]=u[e.root]?Array.from(new Set([...u[e.root],...e.pages])):e.pages})}g(n[Ze]&&n[Ze].subPackages||[]),g(a.subPackages||[]),g(s.subPackages||[]);for(let e in u)o.push({root:e,pages:u[e]});if(p.subPackages=[...o],a.usingComponents){for(let e in a.usingComponents)a.usingComponents[e]="/"+Ve.subPackagePath+a.usingComponents[e];p.usingComponents={...p.usingComponents||{},...a.usingComponents}}return De(),"toutiao"===Ye.type&&p.subPackages&&(p.subPackages.forEach(e=>{e.pages.forEach(t=>{p.pages.push((e.root+"/"+t).replace(/\/\//g,"/"))})}),delete p.subPackages),JSON.stringify(p,null,2)}),{skipBinary:!1})};const rt=p(),{cwd:at,target:st,env:pt,targetPath:it,pluginProcessFileTypes:ot,sourceCodePath:ct}=E,{writeLastLine:lt}=N,{runPlugins:ut}=Pe;n.task("watch:pagesJson",(function(){const e=rt.filter(ot.map(e=>"**/*."+e),{restore:!0});return n.src(ct+"/pages.json",{allowEmpty:!0,cwd:at}).pipe(rt.if("dev"===pt,rt.watch(ct+"/pages.json",{cwd:at},(function(e){lt("处理"+e.relative+"......")})))).pipe(nt("pagesJson")).pipe(rt.rename("app.json")).pipe(e).pipe(rt.replace(/[\s\S]*/,ut(it),{skipBinary:!1})).pipe(e.restore).pipe(n.dest(st,{cwd:at}))}));const gt=p(),{cwd:ft,target:ht,env:mt,base:dt,targetPath:Pt,pluginProcessFileTypes:yt}=E,{writeLastLine:bt}=N,{runPlugins:vt}=Pe;n.task("watch:baseAppJson",(function(){const e=gt.filter(yt.map(e=>`${dt}/**/*.${e}`),{restore:!0});return n.src(dt+"/app.json",{allowEmpty:!0,cwd:ft}).pipe(gt.if("dev"===mt,gt.watch(dt+"/app.json",{cwd:ft},(function(e){bt("处理"+e.relative+"......")})))).pipe(nt("baseAppJson")).pipe(e).pipe(gt.replace(/[\s\S]*/,vt(Pt),{skipBinary:!1})).pipe(e.restore).pipe(n.dest(ht,{cwd:ft}))}));const wt=p(),{cwd:jt,target:kt,env:xt,projectToSubPackageConfig:$t,program:St,currentNamespace:Ot,pluginProcessFileTypes:_t}=E,{writeLastLine:Et}=N,{runPlugins:At}=Pe;n.task("watch:mainAppJson",(function(){const e=$t[Ot.mainMpPath],t=wt.filter(_t.map(t=>`${e}/**/*.${t}`),{restore:!0});return n.src(e+"/app.json",{allowEmpty:!0,cwd:jt}).pipe(wt.if("dev"===xt,wt.watch(e+"/app.json",{cwd:jt},(function(e){Et("处理"+e.relative+"......")})))).pipe(nt("mainAppJson")).pipe(t).pipe(wt.replace(/[\s\S]*/,At(r.resolve(jt,kt+(St.plugin?"/miniprogram":""))),{skipBinary:!1})).pipe(t.restore).pipe(n.dest(kt+(St.plugin?"/miniprogram":""),{cwd:jt}))}));const Ct=p(),{cwd:Nt,target:Rt,env:Mt,projectToSubPackageConfig:Tt,program:Lt,basePath:Bt,currentNamespace:qt,mpTypeNamespace:Ft,pluginProcessFileTypes:Jt}=E,{writeLastLine:Wt}=N,{runPlugins:It}=Pe;n.task("watch:topMode-mainAppJsAndAppWxss",(function(){let e=Tt[qt.mainMpPath];const t=Object.keys(Ft).map(t=>`${e}/app.${Ft[t].css}`),a=Ct.filter([...t],{restore:!0}),s=Ct.filter([e+"/app.js"],{restore:!0}),p=Ct.filter(Jt.map(t=>`${e}/**/*.${t}`),{restore:!0});return n.src([e+"/app.js",...t],{allowEmpty:!0,cwd:Nt}).pipe(Ct.if("dev"===Mt,Ct.watch([e+"/app.js",`${e}/app.${qt.css}`],{cwd:Nt},(function(e){Wt("处理"+e.relative+"......")})))).pipe(s).pipe(Ct.replace(/^/,(function(e){return c.readFileSync(Bt+"/app.js","utf8")+";\n"}),{skipBinary:!1})).pipe(s.restore).pipe(a).pipe(Ct.replace(/^/,(function(e){return c.readFileSync(`${Bt}/app.${qt.css}`,"utf8")+"\n"}),{skipBinary:!1})).pipe(Ct.rename((function(e){e.extname="."+qt.css}))).pipe(a.restore).pipe(p).pipe(Ct.replace(/[\s\S]*/,It(r.resolve(Nt,Rt+(Lt.plugin?"/miniprogram":""))),{skipBinary:!1})).pipe(p.restore).pipe(n.dest(Rt+(Lt.plugin?"/miniprogram":""),{cwd:Nt}))}));const Ut=p(),{cwd:Kt,target:Dt,env:Ht,projectToSubPackageConfig:Yt,base:zt,wxResourcePath:Vt,currentNamespace:Zt,mpTypeNamespace:Gt,pluginProcessFileTypes:Qt}=E,{writeLastLine:Xt}=N,{runPlugins:en}=Pe;n.task("watch:mainWeixinMpPackPath",(function(){const e=Yt[Zt.mainMpPath],a=e+"/"+Yt.subPackagePath,s=Dt+"/"+Yt.subPackagePath,p=[],i=[],o=new Set,l=new Set;Object.keys(Gt).forEach(e=>{p.push(`${a}/**/*.${Gt[e].css}`),i.push(`${a}/**/*.${Gt[e].html}`),o.add("."+Gt[e].css),l.add("."+Gt[e].html)});const u=Ut.filter([...i],{restore:!0}),g=Ut.filter([...p],{restore:!0}),f=(Ut.filter([a+"/**/*.js"],{restore:!0}),Ut.filter(Qt.map(e=>`${a}/**/*.${e}`),{restore:!0}));return n.src([a,a+"/**/*","!"+a+"/pack.config.js"],{allowEmpty:!0,cwd:Kt}).pipe(Ut.if("dev"===Ht,Ut.watch([a,a+"/**/*","!/"+a+"/pack.config.js"],{cwd:Kt},(function(e){Xt("处理"+e.relative+"......")})))).pipe(Ut.filter((function(n){if(n.relative!==Zt.projectConfig&&!function(e){const t=Yt[Zt.mainMpPath]+"/"+Yt.subPackagePath;return!c.existsSync(e.path.replace(r.resolve(Kt,t),r.resolve(Kt,zt)))&&!c.existsSync(e.path.replace(r.resolve(Kt,t),r.resolve(Kt,Vt)))}(n))return!1;if("unlink"===n.event){try{let a=n.path;const s=RegExp(n.extname+"$","i");o.has(n.extname)&&(a=a.replace(s,"."+Zt.css)),l.has(n.extname)&&(a=a.replace(s,"."+Zt.html)),t.sync([a.replace(r.resolve(Kt,e),r.resolve(Kt,Dt))],{force:!0})}catch(e){}return!1}return!0}))).pipe(u).pipe(Ut.rename((function(e){e.extname="."+Zt.html}))).pipe(u.restore).pipe(g).pipe(Ut.rename((function(e){e.extname="."+Zt.css}))).pipe(g.restore).pipe(f).pipe(Ut.replace(/[\s\S]*/,en(r.resolve(Kt,s)),{skipBinary:!1})).pipe(f.restore).pipe(n.dest(s,{cwd:Kt}))}));const tn=p(),{cwd:nn,target:rn,env:an,projectToSubPackageConfig:sn,basePath:pn,subModePath:on,targetPath:cn,program:ln,packIsSubpackage:un,currentNamespace:gn,mpTypeNamespace:fn,pluginProcessFileTypes:hn}=E,{writeLastLine:mn}=N,{runPlugins:dn}=Pe;n.task("watch:mainWeixinMp",(function(){const e=sn[gn.mainMpPath],a=e+"/"+sn.subPackagePath,s=[],p=[],i=new Set,o=new Set;Object.keys(fn).forEach(t=>{s.push(`${e}/**/*.${fn[t].css}`),p.push(`${e}/**/*.${fn[t].html}`),i.add("."+fn[t].css),o.add("."+fn[t].html)});const c=tn.filter([e+"/app.js"],{restore:!0}),l=(tn.filter([e+"/**/*.js"],{restore:!0}),tn.filter([...p],{restore:!0})),u=tn.filter([...s],{restore:!0}),g=tn.filter(hn.map(t=>`${e}/**/*.${t}`),{restore:!0});return n.src([e+"/**/*","!"+e+"/app.json","!"+e+"/**/*.json___jb_tmp___","!"+e+`/**/*.${gn.html}___jb_tmp___`,"!"+e+`/**/*.${gn.css}___jb_tmp___`,"!"+e+"/**/*.js___jb_tmp___","!"+a+"/**/*"],{base:r.resolve(nn,e),allowEmpty:!0,cwd:nn}).pipe(tn.if("dev"===an,tn.watch([e+"/**/*","!/"+e+"/app.json","!/"+a+"/**/*"],{cwd:nn},(function(e){e.relative.match(/.json/),mn("处理"+e.relative+"......")})))).pipe(tn.filter((function(n){if("unlink"===n.event){try{let a=n.path;const s=RegExp(n.extname+"$","i");i.has(n.extname)&&(a=a.replace(s,"."+gn.css)),o.has(n.extname)&&(a=a.replace(s,"."+gn.html)),t.sync([a.replace(r.resolve(nn,e),r.resolve(nn,rn))],{force:!0})}catch(e){}return!1}return!0}))).pipe(c).pipe(tn.replace(/[\s\S]*/,(function(e){if(un.mode||ln.plugin)return e;let t=`./${sn.subPackagePath}/`;if(on===cn){const t=fs.readFileSync(pn+"/app.js","utf8");return e.match(RegExp(t.replace(/\./g,"\\.").replace(/\(/g,"\\(").replace(/\)/g,"\\)")))?e:`${t};\n${e}`}return e.match(RegExp(`require\\('${t.replace(/\./g,"\\.")}app.js'\\)`))?e:`require('${t}app.js');\n${e}`}),{skipBinary:!1})).pipe(c.restore).pipe(l).pipe(tn.rename((function(e){e.extname="."+gn.html}))).pipe(l.restore).pipe(u).pipe(tn.rename((function(e){e.extname="."+gn.css}))).pipe(u.restore).pipe(g).pipe(tn.replace(/[\s\S]*/,dn(r.resolve(nn,rn+(ln.plugin?"/miniprogram":""))),{skipBinary:!1})).pipe(g.restore).pipe(n.dest(rn+(ln.plugin?"/miniprogram":""),{cwd:nn}))}));var Pn={fakeUniBootstrap:function(e,t,n,r){globalObject.__uniapp2wxpack||(globalObject.__uniapp2wxpack={platform:r}),globalObject.onAppHide&&globalObject.onAppShow||(n="none",console.warn("uniapp2wxpack warn: ide不支持appMode设为relegation和top，所以转为none")),"relegation"!==n||globalObject.onAppRoute||(n="top",console.warn("uniapp2wxpack warn: ide不支持appMode设为relegation，但是支持top，所以转为top"));var a=globalObject.__uniapp2wxpack[t.replace("/","")]={__packInit:{}};if(e)for(var s in e)"function"!=typeof e[s]?a.__packInit[s]=e[s]:function(t){a.__packInit[t]=function(){return e[t].apply(e,arguments)}}(s);else e={};if("none"!==n){var p=Page,i=Component,o="",c=1,l=1;"function"==typeof e.onError&&globalObject.onError&&globalObject.onError((function(){return e.onError.apply(e,arguments)})),"function"==typeof e.onPageNotFound&&globalObject.onPageNotFound&&globalObject.onPageNotFound((function(){return e.onPageNotFound.apply(e,arguments)})),"function"==typeof e.onUnhandledRejection&&globalObject.onUnhandledRejection&&globalObject.onUnhandledRejection((function(){return e.onUnhandledRejection.apply(e,arguments)})),globalObject.onAppRoute&&globalObject.onAppRoute((function(r){"top"!==n&&0!==("/"+r.path).indexOf(t+"/")&&(c=1,e.onHide.call(e,globalObject.getLaunchOptionsSync())),o=r.path})),globalObject.onAppHide((function(r){if("top"===n)return globalObject.getLaunchOptionsSync?e.onHide.call(e,globalObject.getLaunchOptionsSync()):e.onHide.call(e,r);var a=getCurrentPages();return 0===("/"+(null==a[a.length-1].route?a[a.length-1].__route__:a[a.length-1].route)).indexOf(t+"/")?(c=1,o="",e.onHide.call(e,globalObject.getLaunchOptionsSync())):void 0})),globalObject.onAppShow((function(t){if(l&&(getApp()&&(getApp().globalData||(getApp().globalData={}),Object.assign(getApp().globalData,e.globalData||{})),l=0),"top"===n&&"function"==typeof e.onShow)return globalObject.getLaunchOptionsSync?e.onShow.call(e,globalObject.getLaunchOptionsSync()):e.onShow.call(e,t)})),"top"===n&&l&&"function"==typeof e.onLaunch&&globalObject.getLaunchOptionsSync&&e.onLaunch.call(e,globalObject.getLaunchOptionsSync()),Page=function(e){return u(e),p.call(this,e)},Component=function(e){return u(e.methods||{}),i.call(this,e)}}function u(r){if("top"!==n){var a=r.onShow;"function"!=typeof e.onShow&&"function"!=typeof e.onLaunch||(r.onShow=function(){var n=getCurrentPages(),r=null==n[n.length-1].route?n[n.length-1].__route__:n[n.length-1].route;if(o&&0===("/"+o).indexOf(t+"/")||0!==("/"+r).indexOf(t+"/")||(c&&(c=0,e.onLaunch.call(e,globalObject.getLaunchOptionsSync())),e.onShow.call(e,globalObject.getLaunchOptionsSync())),"function"==typeof a)return a.apply(this,arguments)})}}},fakeUniBootstrapName:"fakeUniBootstrap"};const yn=p(),{regExpWxResources:bn,regExpUniRequire:vn}=E,{getLevelPath:wn,getLevel:jn}=N;var kn={uniRequireWxResource:function(){return yn.replace(/[\s\S]*/,(function(e,t){const n=["var __uniPackNativeRequireInject={};\n"],r=jn(this.file.relative);return e=e.replace(vn,(e,t)=>{console.log(`\n编译${e}--\x3erequire(${t.replace(bn,wn(r))})`);const a=t.replace(bn,wn(r)),s=`__uniPackNativeRequireInject[${a}] = require(${a});\n`;return 0>n.indexOf(s)&&n.push(s),`__uniPackNativeRequireInject[${a}]`}),n[1]?`${n.join("")} ${e}`:e}),{skipBinary:!1})}};const{currentNamespace:xn,regExpWxResources:$n,wxResourceAlias:Sn}=E,{getLevelPath:On,getLevel:_n}=N;var En=function(e,t){const n=_n(t);return"@import "+`"${Sn}/common/main.${xn.css}";`.replace($n,On(n))+("\n"+e)};const An=p(),{fakeUniBootstrapName:Cn,fakeUniBootstrap:Nn}=Pn,{cwd:Rn,env:Mn,program:Tn,basePath:Ln,targetPath:Bn,subModePath:qn,base:Fn,regExpUniRequire:Jn,regExpWxResources:Wn,regExpUniImportWxss:In,currentNamespace:Un,mpTypeNamespace:Kn,pluginProcessFileTypes:Dn,sourceCodePath:Hn}=E,Yn=process.env.PACK_TYPE,{writeLastLine:zn,getLevel:Vn,getLevelPath:Zn,deepFind:Gn}=N,{uniRequireWxResource:Qn}=kn,{runPlugins:Xn}=Pe,er=Object.keys(Kn).map(e=>Kn[e].css),tr=new Set(er);n.task("subMode:createUniSubPackage",(function(){c.mkdirsSync(Ln);const e=An.filter(Fn+"/**/*.js",{restore:!0}),a=An.filter([Fn+"/common/vendor.js"],{restore:!0}),s=An.filter([Fn+"/common/main.js"],{restore:!0}),p=An.filter(Dn.map(e=>`${Fn}/**/*.${e}`),{restore:!0}),i=An.filter([Fn+"/**/*.js","!"+Fn+"/app.js","!"+Fn+"/common/vendor.js","!"+Fn+"/common/main.js","!"+Fn+"/common/runtime.js"],{restore:!0}),o=An.filter([`${Fn}/**/*.${Un.css}`,`!${Fn}/app.${Un.css}`,`!${Fn}/common/main.${Un.css}`],{restore:!0}),l=An.filter([`${Fn}/**/*.${Un.css}`,`!${Fn}/app.${Un.css}`],{restore:!0}),g=An.filter([Fn+"/**/*.json"],{restore:!0}),f=An.filter([`${Fn}/**/*.${Un.html}`],{restore:!0});return n.src([Fn+"/**","!"+Fn+"/*.*",Fn+"/app.js",`${Fn}/app.${Un.css}`],{allowEmpty:!0,cwd:Rn}).pipe(An.if("dev"===Mn,An.watch([Fn+"/**/*","!/"+Fn+"/*.json"],{cwd:Rn},(function(e){zn("处理"+e.relative+"......")})))).pipe(An.filter((function(e){if(function(e){const t=r.resolve(Bn,"app.js"),n=r.resolve(Bn,"app."+Un.css),a=e.path.replace(Ln,qn);return t===a||n===a}(e))return!1;if("unlink"===e.event){try{let n=e.path;const a=RegExp(e.extname+"$","i");tr.has(e.extname.substr(1))&&(n=n.replace(a,"."+Un.css)),t.sync([n.replace(Ln,r.resolve(Rn,qn))],{force:!0})}catch(e){}return!1}return!0}))).pipe(f).pipe(An.replace(/[\s\S]*/,(function(e){const t=this.file.path.replace(RegExp(Un.html+"$","i"),Un.css),n=this.file.relative.replace(RegExp(Un.html+"$","i"),Un.css);c.existsSync(t)||c.outputFileSync(r.resolve(Rn,qn,n),En("",n));const a=new J(e);let s=0;return Gn(a.topNode,e=>{if(1===e.type&&"wxs"===e.tag&&1===e.children.length&&3===e.children[0].type){e.children[0].text.replace(Jn,(t,n,r,a)=>{const p=Vn(this.file.relative),i=n.replace(Wn,Zn(p)).replace(/['"]/g,"");e.attrsMap.src=i,e.children=[],s=1,console.log(`\n编译${t}--\x3erequire(${i})`)})}}),s?a.render():e}),{skipBinary:!1})).pipe(f.restore).pipe(a).pipe(An.replace(/^/,(function(e){return Tn.plugin?`var App=function(packInit){};${Un.globalObject}.canIUse=function(){return false};`:`var __packConfig=require('../pack.config.js');var App=function(packInit){var ${Cn}=${(""+Nn).replace(/globalObject/g,Un.globalObject)};${Cn}(packInit,__packConfig.packPath,__packConfig.appMode,'${Yn}');};`}),{skipBinary:!1})).pipe(a.restore).pipe(e).pipe(u()).pipe(Qn()).pipe(e.restore).pipe(s).pipe(An.replace(/^/,(function(e){return"var __uniPluginExports={};\n"}),{skipBinary:!1})).pipe(An.replace(/$/,(function(e){return"\nmodule.exports=__uniPluginExports;"}),{skipBinary:!1})).pipe(s.restore).pipe(i).pipe(An.replace(/^/,(function(e){if(c.existsSync(r.resolve(Rn,Hn,this.file.relative)))return e;return`require('${Zn(Vn(this.file.relative))}app.js');\n`}),{skipBinary:!1})).pipe(i.restore).pipe(g).pipe(An.replace(/[\s\S]*/,(function(e){if(!c.existsSync(r.resolve(Rn,Hn,this.file.relative.replace(/json$/,"vue")))&&!c.existsSync(r.resolve(Rn,Hn,this.file.relative.replace(/json$/,"nvue"))))return e;let t=JSON.parse(""+this.file.contents);for(let e in t.usingComponents)0===t.usingComponents[e].indexOf("/")&&(t.usingComponents[e]=Zn(Vn(this.file.relative))+t.usingComponents[e].replace(/^\//,""));return JSON.stringify(t)}),{skipBinary:!1})).pipe(g.restore).pipe(l).pipe(An.stripCssComments()).pipe(An.replace(In,(function(e,t,n){let r="",a=Vn(this.file.relative);return(n+=";").replace(/\s*import\s*:\s*(('[^\s';]*')|("[^\s";]*"))/g,(function(e,t){const n=RegExp(`(${er.join("|")})(['"])$`);t=t.replace(n,Un.css+"$2"),r+=`@import ${t.replace(Wn,Zn(a))};\n`})),t+r}),{skipBinary:!1})).pipe(l.restore).pipe(o).pipe(An.stripCssComments()).pipe(An.replace(/^[\s\S]*$/,(function(e){return qn===Bn?e:En(e,this.file.relative)}),{skipBinary:!1})).pipe(o.restore).pipe(p).pipe(An.replace(/[\s\S]*/,Xn(qn),{skipBinary:!1})).pipe(p.restore).pipe(n.dest(qn,{cwd:Rn}))}));const nr=p(),{cwd:rr,env:ar,targetPath:sr,subModePath:pr,regExpWxResources:ir,regExpUniImportWxss:or,wxResourcePath:cr,currentNamespace:lr,mpTypeNamespace:ur,pluginProcessFileTypes:gr}=E,{writeLastLine:fr,getLevel:hr,getLevelPath:mr}=N,{uniRequireWxResource:dr}=kn,{runPlugins:Pr}=Pe,yr=[],br=[],vr=[],wr=new Set,jr=new Set;Object.keys(ur).forEach(e=>{yr.push(ur[e].css),br.push(`${cr}/**/*.${ur[e].css}`),vr.push(`${cr}/**/*.${ur[e].html}`),wr.add("."+ur[e].css),jr.add("."+ur[e].html)}),n.task("subMode:copyWxResource",(function(){const e=nr.filter([cr+"/**/*.js"],{restore:!0}),a=nr.filter([...br],{restore:!0}),s=nr.filter([...vr],{restore:!0}),p=nr.filter(gr.map(e=>`${cr}/**/*${e}`),{restore:!0});return n.src([cr+"/**",cr],{allowEmpty:!0,cwd:rr}).pipe(nr.if("dev"===ar,nr.watch([cr+"/**",cr,`!/${cr}/**/*.*___jb_tmp___`],{cwd:rr},(function(e){fr("处理"+e.relative+"......")})))).pipe(e).pipe(nr.replace(/^/,(function(e){return`require('${mr(hr(this.file.relative))}app.js');\n`}),{skipBinary:!1})).pipe(u()).pipe(dr()).pipe(e.restore).pipe(a).pipe(nr.stripCssComments()).pipe(nr.replace(or,(function(e,t,n){let r="";hr(this.file.relative);return t+r}),{skipBinary:!1})).pipe(nr.replace(/^[\s\S]*$/,(function(e){return pr===sr?e:En(e,this.file.relative)}),{skipBinary:!1})).pipe(nr.rename((function(e){e.extname="."+lr.css}))).pipe(a.restore).pipe(s).pipe(nr.rename((function(e){e.extname="."+lr.html}))).pipe(s.restore).pipe(nr.filter((function(e){if("unlink"===e.event){try{let n=e.path;const a=RegExp(e.extname+"$","i");wr.has(e.extname)&&(n=n.replace(a,"."+lr.css)),jr.has(e.extname)&&(n=n.replace(a,"."+lr.html)),t.sync([n.replace(r.resolve(rr,cr),r.resolve(rr,pr))],{force:!0})}catch(e){}return!1}return!0}))).pipe(p).pipe(nr.replace(/[\s\S]*/,Pr(pr),{skipBinary:!1})).pipe(p.restore).pipe(n.dest(pr,{cwd:rr}))}));const kr=p(),{cwd:xr,target:$r,env:Sr,projectToSubPackageConfig:Or,currentNamespace:_r,mpTypeNamespace:Er,pluginProcessFileTypes:Ar}=E,{writeLastLine:Cr}=N,{runPlugins:Nr}=Pe;n.task("watch:native",(function(){const e=Or[_r.mainMpPath],a=[],s=[],p=new Set,i=new Set;Object.keys(Er).forEach(t=>{a.push(`${e}/**/*.${Er[t].css}`),s.push(`${e}/**/*.${Er[t].html}`),p.add("."+Er[t].css),i.add("."+Er[t].html)});kr.filter([e+"/**/*.js"],{restore:!0});const o=kr.filter([...s],{restore:!0}),c=kr.filter([...a],{restore:!0}),l=kr.filter(Ar.map(t=>`${e}/**/*.${t}`),{restore:!0});return n.src([e+"/**/*","!"+e+"/app.json"],{base:r.resolve(xr,e),allowEmpty:!0,cwd:xr}).pipe(kr.if("dev"===Sr,kr.watch([e+"/**/*","!/"+e+"/app.json"],{cwd:xr},(function(e){Cr("处理"+e.relative+"......")})))).pipe(kr.filter((function(n){if("unlink"===n.event){try{let a=n.path;const s=RegExp(n.extname+"$","i");p.has(n.extname)&&(a=a.replace(s,"."+_r.css)),i.has(n.extname)&&(a=a.replace(s,"."+_r.html)),t.sync([a.replace(r.resolve(xr,e),r.resolve(xr,$r))],{force:!0})}catch(e){console.log(e)}return!1}return!0}))).pipe(o).pipe(kr.rename((function(e){e.extname="."+_r.html}))).pipe(o.restore).pipe(c).pipe(kr.rename((function(e){e.extname="."+_r.css}))).pipe(c.restore).pipe(l).pipe(kr.replace(/[\s\S]*/,Nr(r.resolve(xr,$r)),{skipBinary:!1})).pipe(l.restore).pipe(n.dest($r,{cwd:xr}))}));const{cwd:Rr,env:Mr,targetPath:Tr,subModePath:Lr,projectToSubPackageConfig:Br,program:qr,currentNamespace:Fr}=E,{tryAgain:Jr}=N;async function Wr(e){let t=r.resolve(Rr,Br[Fr.mainMpPath],"app.js");await c.exists(t)||await c.outputFile(t,"App({});"),e()}n.task("mpWxSubMode",n.series((function(e){console.log("小程序解耦构建开启，此过程如果出现权限问题，请使用管理员权限运行"),e()}),"clean:previewDist",(async function e(t){if(qr.plugin||qr.native)t();else{try{let e={packPath:(Br.subPackagePath?"/":"")+Br.subPackagePath,appMode:Br.appMode};await c.outputFile(Lr+"/pack.config.js","module.exports="+JSON.stringify(e,null,4))}catch(n){return void await Jr(async()=>{await e(t)})}t()}}),function(){let e=[Wr,"subMode:createUniSubPackage","subMode:copyWxResource",...qr.plugin?["watch:pluginJson"]:["watch:baseAppJson","watch:pagesJson",...Br.mergePack?["watch:mainWeixinMpPackPath"]:[],...Lr===Tr?["watch:topMode-mainAppJsAndAppWxss"]:[]],"watch:mainAppJson","watch:mainWeixinMp","watch:projectConfigJson"];return qr.native&&(e=[Wr,"watch:mainAppJson","watch:native"]),"build"===Mr?n.series.apply(this,e):n.parallel.apply(this,e)}(),(function(e){e(),"build"===Mr&&process.exit()})));const{cwd:Ir,basePath:Ur,base:Kr,program:Dr}=E;n.task("startToPackServe",n.series((async function(e){Dr.native||await c.exists(Ur)||await c.mkdirs(Ur),e()}),"clean:base",(function(e){Dr.native?e():n.watch(Kr+"/app.json",{events:["all"],cwd:Ir},(function(){e()}))}),"mpWxSubMode")),process.on("unhandledRejection",()=>{});
