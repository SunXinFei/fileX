## FileX
### 技术栈基于 electron + react + redux + sqlite + immutable
`yarn` install package
`yarn dev` run development environment
### 开发总结 https://github.com/SunXinFei/sunxinfei.github.io/issues/23
## ToDo
[x]:完成  [-]:完成一部分  [ ]:未完成
- [x] immutable.js接入
- [x] 提取路径是否存在逻辑到redux的action中，并使用redux-thunk解决action中异步问题
- [x] 拆分less文件到组件
- [x] loading状态控制
- [x] sider边栏内容拖拽 -包含拖放和排序
- [x] sider边栏增加右击菜单 - 包含右击菜单的展示以及右击菜单目标的选中状态
- [x] 依赖包解读与汇总
- [x] 路径的前进后退
- [x] 项目初始化,将在用户数据文件夹下创建文件,并将该文件夹选中
- [x] 当前未选择文件夹并且边栏列表不为空,则默认选中第一个文件夹
- [x] sqlite数据库接入
- [x] 卡片内容区域框选
- [x] 带滚动条的区域内框选
- [x] ctrl/shift单击多选
- [-] pdf文件展示
- [ ] 单/多个文件选中，控制边栏展示
- [ ] 文件标签与描述
- [ ] 右键文件操作
- [ ] 路径切割并跳转
- [ ] 内容区域交互操作 
- [ ] 快捷键操作
- [ ] 文件搜索与过滤
- [ ] 内容区域与sider区域的交互
- [ ] 操作的redo与undo
- [ ] 文件上传与下载
- [ ] 文件同步
## 遗留BugList
- [ ] sider区域判断是否为当前选中路径，需要添加额外的index来表示，防止出现子路径与父路径同时存在，判断高亮出错的问题
- [ ] 问题原因同上,当移除路径时,if判断会同样失效
## 关于右击菜单
- 菜单的每一项可以通过数据驱动来进行控制展示的内容
- 菜单内容差别过大的可以通过创建新的菜单来控制
## 关于PDF浏览
方案大概有这几种
- 将pdf转图片，比如转svg或者转png，但是中文容易乱码、耗费服务器性能，而且目前没有找到合适的node版本的转换工具。
- 使用jquery.media插件，非常简单的使用方式，api非常简单
- 使用pdf.js，PDF.js可以实现在html下直接浏览pdf文档，开源的pdf文档读取解析插件，pdf.js负责API解析，pdf.worker.js负责核心解析
## 关于shift操作
调研了eagle与kodcloud以及系统文件管理的shift操作流程，各不一致表现的复杂度也不一，，实现逻辑详情见：fileX.xmind
## 关于文件多个不同类型选中逻辑
详情见fileX.xmind
## 可能用到的npm包汇总

```json
{
  "pdf.js": "htps://github.com/mozilla/pdf.js" ,//PDF读取器
  "viewer.js":"https://github.com/fengyuanchen/viewerjs",//JavaScript图像查看器
  "typejs":"http://www.typejs.org/",//排版工具，可提供更好的网页类型。 Type.js允许您编写新的CSS属性以对Web上的字体样式进行更好的排版控制。
  "sweetalert2":"https://sweetalert2.github.io/",//美观的alert框，模态框
  "colorpicker":"https://www.eyecon.ro/colorpicker/",//颜色选择器
  "videojs":"https://videojs.com/",//开源HTML5和Flash视频播放器
  "apng-canvas.js":"https://github.com/davidmz/apng-canvas",//在canvas中执行apng
  "bignumber.js":"https://github.com/MikeMcl/bignumber.js",//数字精度运算库，一个用于任意精度十进制和非十进制算术的JavaScript库
  "html2canvas.js":"",//html转canvas
  "is.js":"https://github.com/arasatasaygin/is.js",//功能强大的校验js，检查类型，正则表达式，状态，时间等
  "PhotoSwipe.js":"https://github.com/dimsemenov/PhotoSwipe",//适用于移动和台式机，模块化，框架独立的JavaScript图片库
  "mousetrap.js":"https://github.com/ccampbell/mousetrap",//用于处理键盘快捷键的简单库
  "selectize.js":"https://github.com/selectize/selectize.js/",//文本框和<select>框的混合体。它基于jQuery，具有自动完成功能和本机感觉的键盘导航；用于标记，联系人列表等  //// 使用react-select
  "pinyin":"https://github.com/creeperyang/pinyin",//轻量的 汉字转拼音 JavaScript库。可以轻松获取汉字的拼音
  "wavesurfer.js":"https://github.com/katspaugh/wavesurfer.js",//基于Web Audio和Canvas构建的可导航波形
    "electron-notarize": "^0.1.1",//无缝公证您的Electron应用程序
   "fontmin": "^0.9.7-beta", //无缝缩小字体 
    "forcefocus": "^1.0.0",//该模块规避了SetFocus（）中的限制，并允许任何窗口窃取焦点。 它在其他平台上重用了Electron内置的焦点。
    "images": "^3.0.1",//Node.js轻量级跨平台图像编解码库
    "json-rest-light": "^2.0.2",//轻量级，纯Node.js，不依赖Json REST服务器，使用HTTP服务器
    "md5": "^2.2.1",//一个JavaScript函数，用于使用MD5对消息进行哈希处理。
    "mozjpeg": "^6.0.1",//mozjpeg是一种生产质量的JPEG编码器，可在保持与大多数已部署解码器兼容的同时提高压缩率
    "opentype.js": "^0.11.0",//opentype.js是用于TrueType和OpenType字体的JavaScript解析器和编写器。 它使您可以从浏览器或Node.js访问文本的字母形式。
    "sudo-prompt": "^8.2.5",//使用sudo运行非图形终端命令，并在必要时通过图形OS对话框提示用户。对于需要Node.js的后台Node.js应用程序或本机Electron应用程序很有用。
    "windows-foreground-love": "^0.2.0",//AllowSetForegroundWindow的API包装器,使指定的进程能够使用SetForegroundWindow函数设置前景窗口
    "winreg": "1.2.4",//node模块，可通过REG命令行工具访问Windows注册表
    "electron": "^2.0.12",
    "electron-packager": "^8.5.1",//electorn打包程序
    "electron-rebuild": "^1.7.3",//将根据您的Electron项目使用的Node.js版本重建本机Node.js模块
    "adm-zip": "^0.4.11",//nodejs的zip的Javascript实现。允许用户在内存或磁盘中创建或提取zip文件
    "app-root-path": "^2.0.1",//确定项目的根路径
    "archiver": "^2.1.1", //用于存档生成的流接口 //用于压缩包相关
    "async": "^2.4.1", //一个实用程序模块，它提供直接，强大的功能来处理异步JavaScript
    "auto-launch": "^5.0.5", //登录时自动启动您的应用程序 //开机启动
    "auto-updater": "^1.0.2", //Node.js自动更新插件。 将本地package.json与存储库package.json进行比较，如果版本不匹配，则下载最新的zip并将其解压缩。
    "bagpipe": "^0.3.5", //灵活地限制异步处理方法的并发量
    "better-sqlite3": "^4.1.4", //Node.js中最快，最简单的SQLite3库
    "buffer-equal": "^1.0.0", //返回两个缓冲区是否相等
    "cancellation": "^1.0.0", //一种使异步操作可取消的方法
    "check-disk-space": "^1.5.0", //多平台库可从路径检查磁盘空间
    "chinese_convert": "^1.0.8", //簡繁體轉換
    "color-convert": "^1.9.0", //JavaScript中的纯色转换功能
    "compare-versions": "^3.0.1", //比较版本号大小 // 10.0.0.1 < 10.0.0.2
    "deep-assign": "^2.0.0", //类似于lodash.merge
    "delta-e": "0.0.7", //将数字用于感知的颜色差异
    "electron-edge-js": "^8.3.6",//在Windows，MacOS和Linux上在线运行.NET和Node.js代码
    "electron-log": "^2.2.7", //只是适用于您的Electron应用程序的简单日志记录模块
    "electron-osx-sign": "^0.4.10",//Codesign Electron macOS应用程序
    "electron-referer": "^0.3.0",//electron应用程序的引荐控件。 //不懂
    "electron-settings": "^2.2.2", //Electron的简单持久用户设置框架
    "electron-util": "^0.6.0", //electron程序和模块的有用实用程序
    "electron-window-state": "^4.0.2",//一个库，用于存储和还原Electron应用程序的窗口大小和位置
    "extract-zip": "^1.6.7",//解压缩zip
    "fast-glob": "^2.2.2",//该软件包提供了遍历文件系统的方法，并根据Unix Bash shell使用的规则返回了与指定模式的定义集匹配的路径名，并进行了一些简化，同时以任意顺序返回结果。快速，简单，有效。
    "ffi": "^2.2.0",//Node.js外部函数接口
    "file-type": "^3.9.0",//检测Buffer / Uint8Array / ArrayBuffer的文件类型
    //"fluent-ffmpeg": "^2.1.2",//一个流畅的api针对ffmpeg，用于记录，转换和流传输音频和视频。
    "fs-extra": "^1.0.0",//fs对象的额外方法，例如copy（），remove（），mkdirs（）
    "get-folder-size": "^1.0.0",//通过递归遍历其所有子文件夹（文件&&文件夹）来获取文件夹的大小。
    "get-json": "0.0.3",//在Node和浏览器上获取请求的JSON文档
    "graceful-fs": "^4.1.11",//graceful -fs可以替代fs模块，从而进行了各种改进。 这些改进旨在使不同平台和环境之间的行为规范化，并使文件系统访问更能抵抗错误。
    "image-size": "^0.5.1",//一个Node模块，用于获取任何图像文件的尺寸
    "isnumber": "^1.0.0",//判断是否为数字
    "jpeg-js": "^0.2.0",//用于node.js的纯JavaScript JPEG编码器和解码器
    "mime": "^2.3.1",//全面，紧凑的MIME类型模块
    "mksnapshot": "^0.3.1",//为Electron创建快照文件
    "moment": "^2.22.2",//时间
    "node-huaban": "^1.4.0",//花瓣(http://huaban.com) 画板下载器
    "node-iptc": "^1.0.4",//该模块从JPEG文件中提取IPTC信息。 IPTC是关于图像的（主要是非技术性的）结构化元数据，具有创建者/艺术家，版权，关键字，类别等字段。 有关更多信息
    "node-machine-id": "^1.1.9",//唯一的计算机（桌面）ID（无需管理员权限
    "node-watch": "^0.4.1",//fs.watch的包装和增强功能。监听文件的增删改重命名等
    "nodejieba": "^2.2.5",//中文分词的Node.js版本
    "nodobjc": "^2.1.0",//Node.js => Objective-C桥
    "normalize-strings": "^1.1.0", //用utf-8字符规范化字符串
    "nsfw": "^1.0.16",//超级快速且可扩展的文件监视程序，可在Linux，OSX和Windows上提供一致的界面
    "omggif": "^1.0.8",//GIF 89a编码器和解码器的JavaScript实现
    "os-locale": "^2.1.0",//获取系统区域设置
    "pngparse": "^2.0.1",//pngparse是Node.JS的纯JavaScript库，用于将PNG文件转换为像素值数组
    "pngquant": "^1.3.0",//pngquant是一个命令行实用工具，是用于PNG图像有损压缩的库。
    "pngquant-bin": "^4.0.0",//pngquant bin-wrapper，使其可以作为本地依赖项无缝使用http://pngquant.org
    "probe-image-size": "^3.0.0",//无需完全下载即可获取图像大小。支持的图像类型：JPG，GIF，PNG，WebP，BMP，TIFF，SVG，PSD。
    "promise.ify": "^0.3.0",//ES5中使用promise
    "pupa": "^1.0.0",//当您需要填写一些占位符时很有用。
    "read-chunk": "^2.0.0",//读取某文件的某一个位置的信息
    "read-multiple-files": "^1.1.1",//读取多个文件
    "ref": "^1.3.5",//获取地址的指针
    "request": "^2.87.0",//简化的HTTP请求客户端
    "request-progress": "^3.0.0",//踪随请求发出的请求的下载进度，从而洞察各种指标，包括进度百分比，下载速度和剩余时间
    "sanitize-filename": "^1.6.1",//清理字符串以用作文件名
    "sharp": "^0.20.5",//高性能Node.js图像处理，是调整JPEG，PNG，WebP和TIFF图像大小的最快模块
    "sips": "^1.0.3",//这是Mac OS X附带的sips命令的简单包装，用于查询和修改图像。 sips命令具有四种模式（图像查询，配置文件查询，图像修改，配置文件修改），在该模块中它们分为4个单独的类
    "stopword": "^0.1.9",//停用词是节点和浏览器的模块，允许您从输入文本中删除停用词。在自然语言处理中，“停止词”是经常使用的词，可以安全地从文本中删除它们而不会改变其含义。
    "stream-to-buffer": "^0.1.0",//该存储库已弃用。请改用stream-to。 将可读流的数据连接到单个Buffer实例中
    "sumchecker": "^2.0.2",//Sumchecker是用于验证校验和文件中指定的文件的纯Node.js解决方案，该文件通常由诸如sha256sum之类的程序生成
    "systeminformation": "^3.49.2",//Node.JS的系统信息库
    "unused-filename": "^0.1.0",//通过添加数字来获取未使用的文件名（如果存在）
    "watch": "^1.0.2",//在node.js中监视文件树的实用程序
    "write-file-atomic": "^2.3.0"//这是节点fs.writeFile的扩展，使它的操作原子化，并允许您设置所有权（文件的uid / gid）
  }
  ```