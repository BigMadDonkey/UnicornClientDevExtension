# unicornclientdev

Unicorn 客户端开发的自用 VSCode Extension

author: LYC

## Features

- 引入开发常用的代码片段
- 支持一步从Share上拷贝主题小Icon到对应目录
- 支持一步从Share上拷贝主题Icon图片资源到对应目录
- 插入新主题代码（待扩展！）
- Status bar icon

## TODO

- [ ] 与LSP API交互，在恰当位置插入必要的代码

## Extension Settings

使用命令面板的Set Unicorn Unity Directory命令，或者直接去扩展设置里修改`Unicornclientdev: Unicorn Unity Directory`为UnicornUnity的所在目录即可。

## Release Notes

2025-09-19: 更新v0.0.2

2025-08-20: 更新v0.0.1

## 附1: Snippets一览

这里列出由此插件添加的代码片段，以免不知道添加的snippets都包含哪些。

```json
{
 // Place your lua snippets here. Each snippet is defined under a snippet name and has a scope, prefix, body and 
 // description. Add comma separated ids of the languages where the snippet is applicable in the scope field. If scope 
 // is left empty or omitted, the snippet gets applied to all languages. The prefix is what is 
 // used to trigger the snippet and the body will be expanded and inserted. Possible variables are: 
 // $1, $2 for tab stops, $0 for the final cursor position, and ${1:label}, ${2:another} for placeholders. 
 // Placeholders with the same ids are connected.
 // Example:
 // "Print to console": {
 //  "scope": "javascript,typescript",
 //  "prefix": "log",
 //  "body": [
 //   "console.log('$1');",
 //   "$2"
 //  ],
 //  "description": "Log output to console"
 // }
 "AddEffect": {
  "scope": "lua",
  "prefix": "adde",
  "body": [
   "EffectsManager:GetInstance():AddEffectByConfig($1, ThemeData:GetInstance():GetThemeEffect($2)[${3| ,board.configLua|}])"
  ],
  "description": "add effect through EffectsManager"
 },
 "RemoveEffect": {
  "scope": "lua",
  "prefix": "rme",
  "body": [
   "EffectsManager:GetInstance():RemoveEffect($1)"
  ],
  "description": "remove effect throught EffectsManager"
 },
 "RemoveEffectByParent": {
  "scope": "lua",
  "prefix": "rmep",
  "body": [
   "EffectsManager:GetInstance():RemoveEffectByParent($1)"
  ],
  "description": "remove effect by parent throught EffectsManager(#Attention: this will remove all effects add under the parent using adde. if you adde on different object, then setParent to this parent, this method will not remove it, v.v.)"
 },
 "RemoveAllEffect": {
  "scope": "lua",
  "prefix": "rma",
  "body": [
   "EffectsManager:GetInstance():DeleteEffectList($1)"
  ],
  "description": "remove every effect in a list throught EffectsManager"
 },
 "ThemeDataInstance": {
  "scope": "lua",
  "prefix": "td",
  "body": [
   "ThemeData:GetInstance()"
  ],
  "description": "themeData get instance"
 },
 "ThemeManagerInstance": {
  "scope": "lua",
  "prefix": "tm",
  "body": [
   "ThemeManager:GetInstance()"
  ],
  "description": "themeManager get instance"
 },
 "AddComponent": {
  "scope": "lua",
  "prefix": "addc",
  "body": [
   "self:AddComponent(${1| , UIText, UIAnimation, UISpineAnimation|}, \"$2\")"
  ],
  "description": "add component"
 },
 "FindTrans": {
  "scope": "lua",
  "prefix": "findt",
  "body": [
   "UIUtil.FindTrans(${1| ,self.transform|}, \"$2\")"
  ],
  "description": "find trans",
 },
 "FindText": {
  "scope": "lua",
  "prefix": "fdt",
  "body": [
   "UIUtil.FindText(${1| ,effect.transform|}, \"$2\")"
  ],
  "description": "find text",
 },
 "FindImage": {
  "scope": "lua",
  "prefix": "fdi",
  "body": [
   "UIUtil.FindImage(${1| ,effect.transform|}, \"$2\")"
  ],
  "description": "find image",
 },
 "GetCacheData": {
  "scope": "lua",
  "prefix": "getc",
  "body": [
   "ThemeData:GetInstance():GetBonusStorageFlowData(\"$1\")"
  ],
  "description": "get cache data"
 },
 "SetCacheData": {
  "scope": "lua",
  "prefix": "setc",
  "body": [
   "ThemeData:GetInstance():SetBonusStorageFlowData(\"$1\", $2)"
  ],
  "description": "set cache data",
 },
 "RemoveCacheData": {
  "scope": "lua",
  "prefix": "rmc",
  "body": [
   "ThemeData:GetInstance():DeleteBonusStorageData(\"$1\")"
  ],
  "description": "remove cache data"
 },
 "LogToConsole": {
  "scope": "lua",
  "prefix": "log",
  "body": [
   "Logger.Log($1)"
  ],
  "description": "log to console",
 },
 "GetUserID": {
  "scope": "lua",
  "prefix": "uid",
  "body": [
   "UserDataManager:GetInstance():GetUserId()"
  ],
  "description": "get current user guid",
 },
 "SetGameObjectActive": {
  "scope": "lua",
  "prefix": "stt",
  "body": [
   "gameObject:SetActive(true)"
  ],
  "description": "set GameObject active true"
 },
 "SetGameObjectDeactive": {
  "scope": "lua",
  "prefix": "stf",
  "body": [
   "gameObject:SetActive(false)"
  ],
  "description": "set GameObject active false"
 },
 "StartCoroutine": {
  "scope": "lua",
  "prefix": "sttc",
  "body": [
   "coroutine.startcoroutine(\"C_Theme10$1\", \"$2\", function ()\n\t$3\nend)"
  ],
  "description": "start a new coroutine"
 },
 "StopCoroutine": {
  "scope": "lua",
  "prefix": "stop",
  "body": [
   "coroutine.stopcoroutine(\"C_Theme10$1\", \"$2\")"
  ],
  "description": "stop an existing coroutine"
 },
 "CoroutineWaitSeconds": {
  "prefix": "wait",
  "body": [
   "coroutine.waitforseconds($1)"
  ],
  "description": "coroutine wait for seconds"
 },
 "CoroutineWaitUntil": {
  "scope": "lua",
  "prefix": "waitu",
  "body": [
   "coroutine.waituntil(function() \n\treturn $1 \nend)"
  ],
  "description": "coroutine wait for seconds"
 },
 "PlayAudio": {
  "scope": "lua",
  "prefix": "audio",
  "body": [
   "CS.AudioController.Play($1)"
  ],
  "description": "play certain audio"
 },
 "FormatNumberLong": {
  "scope": "lua",
  "prefix": "long",
  "body": [
   "MathUtils.FormatNumLong($1)"
  ],
  "description": "format number with long type"
 },
 "FormatNumberShort": {
  "scope": "lua",
  "prefix": "short",
  "body": [
   "MathUtils.FormatNumShort($1)"
  ],
  "description": "format number with short type"
 },
 "FormatNumberShortMul": {
  "scope": "lua",
  "prefix": "shortm",
  "body": [
   "MathUtils.FormatNumShortMul($1, $2)"
  ],
  "description": "multiply 2 parameters first, the result use format number short type"
 },
 "FormatNumberShortSix": {
  "scope": "lua",
  "prefix": "short6",
  "body": [
   "MathUtils.FormatNumSix($1)"
  ],
  "description": "format number with short type, 6 number"
 },
 "BigNumMul": {
  "scope": "lua",
  "prefix": "bmul",
  "body": [
   "MathUtils.BigNumMul($1, $2)"
  ],
  "description": "BigNum Multiply"
 },
 "BigNumAdd": {
  "scope": "lua",
  "prefix": "badd",
  "body": [
   "MathUtils.BigNumAdd($1, $2)"
  ],
  "description": "BigNum Add"
 },
 "PopupUINoChoiceBtn": {
  "scope": "lua",
  "prefix": "popn",
  "body": [
   "local popup_params = {",
   "totalDelayTime = $1,",
   "customEndCallback = function(popup)",
   "$2",
   "end,",
   "}",
   "UIChoiceNoBtnCtrl:GetInstance():PopupChoiceNoBtnUI(\"$3\", popup_params)"
  ],
  "description": "popup ui without any choice button"
 },
 "PopupUIOneChoiceBtn": {
  "scope": "lua",
  "prefix": "popo",
  "body": [
   "local popup_params = {$1",
   "customClickCallback = function(popup)",
   "$2",
   "end,",
   "}",
   "UIChoiceOneBtnCtrl:GetInstance():PopupChoiceOneBtnUI(\"$3\", popup_params)"
  ],
  "description": "popup ui with one choice button"
 },
 "PopupUITwoChoicesBtn": {
  "scope": "lua",
  "prefix": "popt",
  "body": [
   "local popup_params = {$1}",
   "UIChoiceTwoBtnCtrl:GetInstance():PopupChoiceTwoBtnUI(\"$2\", popup_params)"
  ],
  "description": "popup ui with two choices button"
 },
 "SendMessage": {
  "scope": "lua",
  "prefix": "send",
  "body": [
   "NetManager:GetInstance():SendMessage(MsgID.$1, {})"
  ],
  "description": "send message to server"
 },
 "DestroyDirectPrefab": {
  "scope": "lua",
  "prefix": "destroy",
  "body": [
   "GameObjectPoolByPrefab:GetInstance():DestroyDirectPrefab(fly_effect.gameObject)",
   "EffectsManager:GetInstance():RemoveEffect(fly_effect)"
  ],
  "description": "destroy direct prefab(normally used for fly effect)"
 },
 "TableInsert": {
  "scope": "lua",
  "prefix": "ins",
  "body": [
   "table.insert($1, $2)"
  ],
  "description": "table insert"
 },
 "Step": {
  "scope": "lua",
  "prefix": "step",
  "body": [
   "view.currentGameBoard:Step()"
  ],
  "description": "step to next behavior"
 },
 "CurrentBet": {
  "scope": "lua",
  "prefix": "bet",
  "body": [
   "ThemeData:GetInstance():GetCurrentBet()"
  ],
  "description": "get current bet"
 },
 "CurrentBetString": {
  "scope": "lua",
  "prefix": "bets",
  "body": [
   "ThemeData:GetInstance():GetCurrentBetString()"
  ],
  "description": "get current bet string"
 },
 "FormatBetString": {
  "scope": "lua",
  "prefix": "fbets",
  "body": [
   "ThemeData.FormatBetToString($1)"
  ],
  "description": "turn an existent bet value to its string format"
 },
 "AddDeltaWinToFooter": {
  "scope": "lua",
  "prefix": "addw",
  "body": [
   "view.ctrl:AddDeltaWinToFooter($1)"
  ],
  "description": "add delta win to footer"
 },
 "IsInTheme": {
  "scope": "lua",
  "prefix": "isint",
  "body": [
   "ThemeManager:GetInstance():IsInTheme()"
  ],
  "description": "is in theme?"
 },
 "ResetBGM": {
  "scope": "lua",
  "prefix": "bgm",
  "body": [
   "view:ResetBackgroundMusic(\"$1\")",
   "GlobalSettingManager:GetInstance():SetBackgroundMusicVolumeTo(1)"
  ],
  "description": "reset bgm and set volume to 1"
 },
 "StopBGM": {
  "scope": "lua",
  "prefix": "stopbgm",
  "body": [
   "GlobalSettingManager:GetInstance():StopBackgroundMusic()"
  ],
  "description": "stop bgm"
 },
 "PauseBGM": {
  "scope": "lua",
  "prefix": "pausebgm",
  "body": [
   "GlobalSettingManager:GetInstance():PauseBackgroundMusic($1)"
  ],
  "description": "pause bgm (in x seconds?)"
 },
 "ResumeBGM": {
  "scope": "lua",
  "prefix": "resumebgm",
  "body": [
   "GlobalSettingManager:GetInstance():ResumeBackgroundMusic($1)"
  ],
  "description": "resume bgm (in x seconds?)"
 },
 "ChangeBGMVolume": {
  "scope": "lua",
  "prefix": "changebgmvolume",
  "body": [
   "GlobalSettingManager:GetInstance():ChangeBackgroundMusicVolumeTo(${1:targetVolume}, ${2:duration}, ${3:delay})"
  ],
  "description": "change bgm volume (in x seconds, delay y seconds?)"
 },
 "LockBGMChange": {
  "scope": "lua",
  "prefix": "lockbgm",
  "body": [
   "GlobalSettingManager:GetInstance():LockChangeBackgroundMusicVolume(true)"
  ],
  "description": "lock bgm volume change"
 },
 "CoinAnimator": {
  "scope": "lua",
  "prefix": "coin_ani",
  "body": [
   "SlotNumber.New(0, math.huge, 0, 0.01, 1000, true, nil, MathUtils.FormatNumberLong)"
  ],
  "description": "play coin animator"
 },
 "BreakPoint": {
  "scope": "lua",
  "prefix": "bp",
  "body": [
   "local isFind, debugger = pcall(function(modname)",
   "  return require(modname)",
   "end, \"LuaPanda\")",
   "local ret = debugger.BP and debugger.BP()",
   "Logger.Log(\"BP ret: \" .. tostring(ret))"
  ],
  "description": "break point"
 },
}

```
