import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import {actions as userActions, getCurrentTab, getDeletingOrderId} from '../../../../redux/modules/user'
import Confirm from '../../../../components/Confirm'
import OrderItem from '../../components/OrderItem'
import './style.css'


const tabTitles = ["全部订单", "待付款", "可使用", "退款/售后"]

// const data = [
//   {
//     id: "o-2",
//     statusText: "已消费",
//     orderPicUrl:
//       "https://p1.meituan.net/deal/95e79382c20a78da3068c4207ab7a9b4329494.jpg.webp@700w_700h_1e_1c_1l|watermark=1&&r=1&p=9&x=20&y=20",
//     channel: "团购",
//     title: "华莱士：华莱士单人套餐",
//     text: ["1张 | 总价：￥11.99", "有效期至2018-09-17"],
//     type: 1
//   }
// ];

class UserMain extends Component {
  // constructor(props) {
  //   super(props)
  //   this.state = {
  //     currentTab: 0,
  //   }
  // }

  render() {
    // const { currentTab } = this.state;
    const {currentTab, data, deletingOrderId} = this.props
    return (
      <div className="userMain">
        <div className="userMain__menu">
          {
            tabTitles.map((tab, index) => {
              return (
                <div
                  key={index}
                  className="userMain__tab"
                  onClick={this.handleClickTab.bind(this, index)}
                >
                  <span
                    className={
                      currentTab === index ? 
                      "userMain__title userMain__title--active" :
                      "userMain__title"
                    }
                  >
                    {tab}
                  </span>
                </div>
              )
            })
          }
        </div>
        <div className="userMain__content">
          { data && data.length > 0 ? this.renderOrderList(data) : this.renderEmpty()}
        </div>
        {deletingOrderId ? this.renderConfirmDialog() : null}
      </div>
    );    
  }

  handleClickTab = (index) => {
    // this.setState({
    //   currentTab: index
    // })
    this.props.userActions.setCurrentTab(index)
  }

  // TODO
  handleRemove = (orderId) => {
    this.props.userActions.showDeleteDialog(orderId)
  }

  renderOrderList = (data) => {
    
    return data.map(item => {
      return (
        <OrderItem key={item.id} data={item} onRemove={this.handleRemove.bind(this, item.id)}/>
      )      
    })
  }

  renderEmpty = () => {
    return (
      <div className="userMain__empty">
        <div className="userMain__emptyIcon"></div>
        <div className="userMain__emptyText1">
          您还没有相关订单
        </div>
        <div className="userMain__emptyText2">
          建议您去看看有什么想买的
        </div>
      </div>
    )
  }

  renderConfirmDialog = () => {
    const {userActions: {hideDeleteDialog, removeOrder}} = this.props
    return (
      <Confirm
        content="确定删除该订单吗？"
        cancelText="取消"
        confirmText="确定"
        onCancel={hideDeleteDialog}
        onConfirm={removeOrder}
      />      
    )
  }

}

const mapStateToProps = (state, props) => {
  return {
    currentTab: getCurrentTab(state),
    deletingOrderId: getDeletingOrderId(state)
  }
}

const mapDispathToProps = (dispatch, props) => {
  return {
    userActions: bindActionCreators(userActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispathToProps)(UserMain);