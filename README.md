<p align="center">
  <b>protpl</b>
  <br />
  <span>帮助你快速创建各种项目工程！</span>
  <br>
  <a href="https://www.npmjs.org/package/protpl"><img src="https://img.shields.io/npm/v/protpl.svg?style=flat" alt="npm"></a> <a href="https://travis-ci.org/echosoar/protpl"><img src="https://travis-ci.org/echosoar/protpl.svg?branch=master" alt="travis"></a>
  <br>
  <img src="./docs/usage.gif" width="600" height="300" alt="Protpl">
  <br>
  
</p>

## 使用
```shell
$ npm i protpl -g
```

```shell
$ p init
```

## 目前支持的模板类型
+ ts-module: 基于TypeScript的模块工程
+ lerna-ts-module: 基于Lerna的多个TypeScript模块工程
+ js-module: 使用Rollup构建的JavaScript模块工程

## 选项
### Init
#### --npm=<npm>
可以指定npm镜像，如cnpm等
#### --name=<模板类型>
用于指定使用哪个模板进行初始化，默认为显示选择列表