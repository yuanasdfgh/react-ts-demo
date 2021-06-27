## 初始化 项目

npx create-react-app apple-react-pc --template typescript

## yarn start

## yarn build

## 绝对路径设置

### 绝对路径配置

tsconfig.json
添加 baseUrl :"./src"
绝对路径会从./src 下寻找

## 代码规范

https://prettier.io/docs/en/install.html

1. yarn add --dev --exact prettier
2. echo {}> .prettierrc.json 新建配置文件
3. 不需要格式化的文件

## mock server

安装 yarn add json-server -D
配置 package.json "json-server":"json-server _server_/db.json --watch --port 3001"
