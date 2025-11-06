# Change Log

## v0.0.4（开发中）

新增命令：`addGMStarAndNewThemePos`: 为新创建的主题添加GM星标位置代码和新主题位置代码。

新增命令：`formatOpenSearchData`: 格式化OpenSearch数据,转化为GM上可直接使用的格式。使用本命令需注意：**必须在编辑器中focus到一个打开的文本，并且这个文本的命名为temp才可使用，会处理文本中所有内容。** 这样做是为了防止误操作其他的文件。想使用本命令时，先新建一个名为temp的文本文件，将OpenSearch数据粘贴进去，然后focus到这个文本，再使用本命令。

更新命令：`insertNewThemeCode`: 新增了插入主题Controller代码的逻辑，插入基类定义以及升级接口。

## v0.0.3

新增命令：`newThemeEditProcessorHandler`: 自动将新创建的Processor里的Handler函数的方法签名修改为点引用，并在参数列表中加上开头的“board”，避免歧义。

新增命令：`themeLowResCheckConfig`: 检测并设置主题低特效相关代码配置。

fileUtils新增将某文件指定行替换为给定字符串的工具函数；commonUtils新增给定主题ID，获取ControllerName和ThemeName的工具函数。

## v0.0.2

封装输出提示信息的API，不仅弹出通知提示，还同时输出到output.

snippets 参考API并没有动态打开关闭的方法，因此不能配置激活关闭，若是不想要了只能禁用扩展了。

整理了fileUtils的工具函数的抛出异常的标准，对于复制单个URL文件的函数，如果URL不存在，并不直接抛出异常，而是return false。即使真发生了异常，也不立刻输出错误信息，抛出到上一层去catch。

整体了一些工具函数到commonUtils。

新增命令：`copyThemeIcon`: 添加了复制主题Icon图片到指定目录（ThemeLogoNew/ThemeXXXXXIcon）的逻辑，目前会将Share-Unicorn/Theme/Theme_icon/XXXXX/image下的所有目录和图片文件复制过去。

新增命令：`insertNewThemeCode`: 设计为给新创建的主题自动做一些代码层面的操作，目前只实现了给定主题ID，读取主题命名并插入Controller定义到Global_5.lua中，后面应该会扩展。

## v0.0.1

最基本功能Init，扩展的命令注册、config保存、status Bar的状态更新和snippets，添加了copy remote share-Unicorn服务器资源 到UnicornUnity目录上的功能。

添加license。
