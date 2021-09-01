import React, { Component } from 'react';
import './style.css'

class PurchaseForm extends Component {
  
  render() {
    const {product: {currentPrice}, phone, quantity} = this.props        
    const totalPrice = (currentPrice * quantity).toFixed(1)
    return (
      <div className="purchaseForm">
        <div className="purchaseForm__wrapper">
          <div className="purchaseForm__row">
            <div className="purchaseForm__rowLabel">数量</div>
            <div className="purchaseForm__rowValue">
              <span 
                className="purchaseForm__counter--dec"
                onClick={this.handleDecrease}
              >-</span>
              <input type="number" className="purchaseForm__quantity" onChange={this.handleChange} value={quantity} />
              <span 
                className="purchaseForm__counter--inc"
                onClick={this.handleIncrease}
              >+</span>
            </div>
          </div>
          <div className="purchaseForm__row">
            <div className="purchaseForm__rowLabel">小计</div>
            <div className="purchaseForm__rowValue">
              <span className="purchaseForm__totalPrice">¥{totalPrice}</span>
            </div>
          </div>
          <div className="purchaseForm__row">
            <div className="purchaseForm__rowLabel">手机号</div>
            <div className="purchaseForm__rowValue">{phone}</div>
          </div>          
        </div>
        <ul className="purchaseForm__remark">
          <li
            className="purchaseForm__remarkItem"
          >
            <i className="purchaseForm__sign"></i>
            <span className="purchaseForm__desc">支持随时退</span>            
          </li>
          <li
            className="purchaseForm__remarkItem"
          >
            <i className="purchaseForm__sign"></i>
            <span className="purchaseForm__desc">支持过期退</span>        
          </li>
        </ul>
        <a className="purchaseForm__submit" onClick={this.handleClick}>立即提交</a>
        
      </div>
    );
  }

  handleDecrease = () => {
    const {quantity} = this.props
    quantity > 0 &&  this.props.onSetQuantity(quantity-1)
  }

  handleIncrease = () => {
    const {quantity} = this.props
    this.props.onSetQuantity(quantity+1)
  }

  handleChange = (e) => {    
    this.props.onSetQuantity(Number.parseInt(e.target.value))
  }

  handleClick = () => {
    const {quantity} = this.props
    quantity > 0 && this.props.onSubmit()
  }
}

export default PurchaseForm;