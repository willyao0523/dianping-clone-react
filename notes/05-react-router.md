## React-Router

### 客户端路由和服务器路由
- 服务器路由
![image.png](https://i.loli.net/2021/02/19/yi9fePba2khXO61.png)

- 客户端路由
![image.png](https://i.loli.net/2021/02/19/iMuaR7L6mNdcTBb.png)

### Router相关库
- react-router
- react-router-dom
- react-router-native

### <Router>
创建一个上下文，保证React-Router的正常工作。在Web工作环境中主要使用：
- <BrowserRouter>
  - 基于HTML5 hostory API（pushState，replaceState等）
  - 需要Web服务器额外配置
- <HashRouter>
  - 使用url的hash部分作为额外信息
  - 主要为了兼容老版本浏览器

### 路由配置：Route
- path
- match
  - `path="/user/:userId" component={User}`
  - match会将匹配到的值userId传递到User组件的props.match中，并在match.params中可以调取该参数

### 路由匹配
- exact
- <Switch>
  - 只会匹配第一个匹配成功的Route

### 路由渲染组件的方式
- <Route component>
  - react组件本质上就是函数
  - `<Route path="..." component={() => <About/>}`
- <Route render>
  - 可以创建更加复杂的组件
  - `<Route path="..." render={(props) => <About {...props} />} />`  
- <Route children>
  - props.match来表示是否匹配了当前路由  

### React-Router4新思维
- 一切皆组件
- 动态路由的离散式声明方式  