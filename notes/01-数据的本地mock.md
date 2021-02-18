## 数据Mock
- 方式1：代理到mock服务器
1. 安装serve
```
npm install -g serve
```
2. 在对应的文件夹启动
比如在test文件夹下有api文件夹，其下有data.json；我们在test文件夹层级使用`serve`使得其下数据可以用其对应地址访问
3. 修改package.json在后面添加代理转发
```javascript
"proxy": {
  "/api": {
    "target": "http://localhost:5000" // 此处为serve启动后的服务器地址
  }
}
```

- 方式2：直接将mock数据放到项目public文件夹
我们可以直接在public文件夹下创建我们的假数据，然后可以直接访问。比如我们在public文件夹下添加一个mock文件夹，下面再添加一个data.json。服务启动以后我们就可以通过`localhost:3000/mock/data.json`直接访问。public下面的资源将原封不动的作为静态资源进行使用。