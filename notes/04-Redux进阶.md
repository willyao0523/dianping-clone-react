## Redux进阶

### 项目结构组织方式
- 按照类型
官网使用的组织结构方式
```
actions/
  - action1.js
  - action2.js

components/
  - component1.js
  - component2.js

reducers/
  - reducer1.js
  - reducer2.js

containers/
  - container1.js
  - container2.js
```

- 按照功能模块
很可能出现耦合的情况
```
feature1/
  - components/
  - containers.js
  - actions.js
  - reducer.js

feature2/
  - components/
  - containers.js
  - actions.js
  - reducer.js  
```

- Ducks（鸭子）

### State设计原则
- 常见两种错误
  - 以API为设计State的依据
  - 以页面UI为设计State的依据
- 应该像设计数据库一样设计State
  - 如何设计数据库
    - 数据按照领域（Domain）分类，存储在不同的表中，不同的表中存储的列数据不能重复
    - 表中每一列的数据都依赖于这张表的主键
    - 表中除了主键以外的其他列，互相之间不能有直接依赖关系  
  - 如何设计State
    - 数据按照领域把整个应用的状态按照领域（Domain）分成若干子State，子State之间不能保存重复的数据
    - 表中State以键值对的结构存储数据，以记录的key/ID作为记录的索引，记录中的其他字段都依赖于索引
    - State中不能保存可以通过已有数据计算而来的数据，即State中的字段不相互依赖
- 补充
  - State应该尽量扁平化（避免嵌套层级过深）
  - UI State：具有松散型的特点

### Selector函数
![selector.jpg](https://i.loli.net/2021/02/19/UJcg1KTxOaoi2V6.jpg)

### 深入理解前端状态管理思想
![image.png](https://i.loli.net/2021/02/19/6zlt4Npn9fLv38S.png)

### Middleware中间件
- 如redux-thunk
- 增强store dispatch的能力
- redux中间件是一个函数，函数签名为`Function: ({getState, dispatch}) => next => action`

### store enhancer
- 增强redux store的功能
- `createStore(reducer, [preloadedState], [enhancer])`
- `Function: (createStore) => (...args) => {}`

### Middleware和Store Enhancer的关系
- middleware是store enhancer的一种

### immutable.js
- 简化操作和提高效率

### reselect.js
- 减少state的重复计算
