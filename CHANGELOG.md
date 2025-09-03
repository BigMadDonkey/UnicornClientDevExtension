# Change Log

## v0.0.2

封装输出提示信息的API，不仅弹出通知提示，还同时输出到output.

snippets 参考API并没有动态打开关闭的方法，因此不能配置激活关闭，若是不想要了只能禁用扩展了。

整理了fileUtils的工具函数的抛出异常的标准，对于复制单个URL文件的函数，如果URL不存在，并不直接抛出异常，而是return false。即使真发生了异常，也不立刻输出错误信息，抛出到上一层去catch。

添加了复制主题Icon图片到指定目录（ThemeLogoNew/ThemeXXXXXIcon）的逻辑，目前会将Share-Unicorn/Theme/Theme_icon/XXXXX/image下的所有目录和图片文件复制过去。

## v0.0.1

最基本功能Init，扩展的命令注册、config保存、status Bar的状态更新和snippets，添加了copy remote share-Unicorn服务器资源 到UnicornUnity目录上的功能。

添加license。
