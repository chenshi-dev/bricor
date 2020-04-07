# bricor
CLI for organizing multirepoful project

## TL;DR
Bricor 被设计为 multirepoful 管理项目的 CLI，主要提供自动化脚本，自动化 link 等功能。

## Usage

```shell
# yarn
yarn add 

# npm
npm i 
```

## CLI

`bricor init` 初始化 Bricor 配置文件
`bricor bootstrap` 根据 `.bricor.json` 完成一些启动工作
`bricor update` 更新 git submodule

## Config

运行 `bricor bootstrap` 会去解析 `.bricor.json`，配置文件的顶层结构是一个数组，每个 `git submodule` 对应一个配置，字段说明如下:

`path` ： `gitsubmodule` 相对于项目根目录的路径，bricor 会沿着 `path` 寻找该 `submodule`。

`name` ： `gitsubmodule` 的模块名称

`repo` ：仓库地址

`[subPkgs]` ： 记录仓库下的所有的子包的路径

`[exec]`: 在 bootstrap 后会执行的一些命令


### Example

**单模块**
```json
[
  {
    "path": "shared",
    "name": "shared",
    "repo": "https://github.com/sjtushi/fe-shared",
    "subPkgs": {
      "@shared/library": "./library",
      "@shared/configs": "./configs"
    },
    "exec": [
      {
        "pkg": "@shared/library",
        "exec": ["npm install", "npm run build"]
      }
    ]
  }
]
```

**多模块**

```json
[
  {
    "path": "bar",
    "name": "bar",
    "repo": "https://github.com/sjtushi/bar",
    "subPkgs": {
      "@shared/library": "./library",
      "@shared/configs": "./configs"
    },
    "exec": [
      {
        "pkg": "@shared/library",
        "exec": ["npm install", "npm run build"]
      }
    ]
  },
  {
    "path": "foo",
    "name": "foo",
    "repo": "https://github.com/sjtushi/foo",
  }
]
```
