# protpl

帮助你快速创建各种项目工程！

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