## Redux思想
- 状态管理库
- 复杂的状态: API数据、本都数据、UI状态等
- 视图和状态管理解耦，防止状态管理失控
- 视图层：React；状态管理层：Redux
![redux.jpg](https://i.loli.net/2021/02/18/1sB5TRWeKgOzQIU.jpg)
Redux数据流：
- Store是Redux的核心，包含State
- State用于定义UI，State的内容和结构决定了UI的外表
- UI层我们可以触发Action动作
- 每一个Action旨在将一个state更改成为另外一个state，并且action会发送给Reducer
- Reducer会根据action中的描述修改Store中对应的state从而我们得到新的state
- 新的state又会定义出新的UI，如此往复

### 设计应用State
- 集中管理，全局唯一
- 不可变性
- 定义方式如同React State

### 定义Action
- 描述如何修改状态
- JSON对象，type属性必需
- 发送Action: store.dispatch

### Action的处理器：Reducer
Reducer()获取Action，并对Previous State进行修改形成 New State

### Reducer拆分
- 便于扩展和维护
- 合并API：combineReducers

### 创建Store
![store.jpg](https://i.loli.net/2021/02/18/sSALecyEhFrf7Ua.jpg)

### 集成react-redux（容器型组件拆分）
- 向根组件注入Store - Provider组件
- 连接React组件和Redux状态层 - Connect
- 获取React组件所需的State、Actions - map api: mapStateToProps, mapDispathToProps

#### 展示型组件和容器性组件
| | 展示型组件 | 容器性组件|
|---|---|---|
|关注点|UI的展现|逻辑（取数据、更新状态等）|
|对Redux层是否有感知|否|是|
|读数据|从props中获取|从Redux store中获取|
|写数据|调用props传递的回调|发送Redux actions|
|如何创建|手写|通过react-redux创建|

### 集成react-redux（容器型编写）

### 异步Action
- fetch
- react-thunk

### Redux调试工具
redux-devtools