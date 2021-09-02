import React, { Component } from 'react';
import Header from '../../components/Header'
import PurchaseForm from './components/PurchaseForm'
import Tip from '../../components/Tip'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {actions as purchaseActions, getQuantity, getTipStatus, getTotalPrice, getProduct} from '../../redux/modules/purchase'
import {getUsername} from '../../redux/modules/login'
import {actions as detailActions} from '../../redux/modules/detail'


class Purchase extends Component {
  render() {
    const {quantity, tipStatus, product, phone, totalPrice} = this.props
    return (
      <div>
        <Header title="下单" onBack={this.handleBack} />
        {product ? 
        <PurchaseForm 
          quantity={quantity} 
          phone={phone} 
          product={product}
          totalPrice={totalPrice}
          onSetQuantity={this.handleSetQuantity}
          onSubmit={this.handleSubmit}
        /> : null}
        {
          tipStatus ? 
            <Tip message="购买成功" onClose={this.handleCloseTip} /> :
            null
        }        
      </div>
    );
  }

  componentDidMount() {
    const {product} = this.props
    if(!product) {
      const productId = this.props.match.params.id
      this.props.detailActions.loadProductDetail(productId)
    }
  }

  componentWillUnmount() {
    this.props.purchaseActions.setOrderQuantity(1)
  }

  handleBack = () => {
    this.props.history.goBack()
  }

  handleCloseTip = () => {
    this.props.purchaseActions.closeTip()
  }

  handleSetQuantity = (quantity) => {
    this.props.purchaseActions.setOrderQuantity(quantity)
  }

  handleSubmit = () => {
    const productId = this.props.match.params.id
    this.props.purchaseActions.submitOrder(productId)
  }
}

const mapStateToProps = (state, props) => {
  const productId = props.match.params.id
  return {
    product: getProduct(state, productId),
    quantity: getQuantity(state),
    tipStatus: getTipStatus(state),
    phone: getUsername(state),
    totalPrice: getTotalPrice(state, productId)
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    purchaseActions: bindActionCreators(purchaseActions, dispatch),
    detailActions: bindActionCreators(detailActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Purchase);