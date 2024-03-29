import createReducer from '../../../utils/createReducer'

export const schema = {
  name: "orders",
  id: "id",
}

export const USED_TYPE = 1;
export const TO_PAY_TYPE = 2;
export const AVAILABLE_TYPE = 3;
export const REFUND_TYPE = 4;

export const types = {
  DELETE_ORDER: 'ORDERS/DELETE_ORDER',
  ADD_COMMENT: 'ORDERS/ADD_COMMENT',
  ADD_ORDER: 'ORDERS/ADD_ORDER',
}

let orderIdCounter = 10

export const actions = {
  deleteOrder: (orderId) => ({
    type: types.DELETE_ORDER,
    orderId
  }),
  addComment: (orderId, commentId) => ({
    type: types.ADD_COMMENT,
    orderId,
    commentId
  }),
  addOrder: order => {
    const orderId = `0-${orderIdCounter++}`    
    return ({
      type: types.ADD_ORDER,
      orderId,
      order: {...order, id:orderId}
    })
    
  }
}

const normalReducer = createReducer(schema.name)

const reducer = (state = {}, action) => {
  if(action.type === types.ADD_ORDER) {
    return {
      ...state,
      [action.orderId]: action.order
    }
  }

  if(action.type === types.ADD_COMMENT) {
    return {
      ...state,
      [action.orderId]: {
        ...state[action.orderId],
        commentId: action.commentId
      }
    }
  }
  if(action.type === types.DELETE_ORDER) {
    const {[action.orderId]: deleteId, ...restOrders} = state
    return restOrders
  } else {
    return normalReducer(state, action)
  }
}

export default reducer;

// selector
export const getOrderById = (state, id) => {
  return state.entities.orders[id]
}

export const getAllOrders = state => state.entities.orders