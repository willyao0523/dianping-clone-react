import { combineReducers } from 'redux'
import url from '../../utils/url'
import { FETCH_DATA } from '../middlewares/api'
import {
  schema, 
  TO_PAY_TYPE, 
  AVAILABLE_TYPE, 
  REFUND_TYPE,
  getOrderById,
  actions as orderActions,
  types as orderTypes
} from './entities/orders'

const initialState = {
  orders: {
    isFetching: false,
    ids: [],
    toPayIds: [],
    availableIds: [],
    refundIds: []
  },
  currentTab: 0,
  currentOrder: {
    id: null,
    isDeleting: false
  }
}

export const types = {
  FETCH_ORDERS_REQUEST: 'USER/FETCH_ORDERS_REQUEST',
  FETCH_ORDERS_SUCCESS: 'USER/FETCH_ORDERS_SUCCESS',
  FETCH_ORDERS_FAILURE: 'USER/FETCH_ORDERS_FAILURE',
  SET_CURRENT_TAB: 'USER/SET_CURRENT_TAB',

  DELETE_ORDERS_REQUEST: 'USER/DELETE_ORDERS_REQUEST',
  DELETE_ORDERS_SUCCESS: 'USER/DELETE_ORDERS_SUCCESS',
  DELETE_ORDERS_FAILURE: 'USER/DELETE_ORDERS_FAILURE',

  SHOW_DELETE_DIALOG: 'USER/SHOW_DELETE_DIALOG',
  HIDE_DELETE_DIALOG: 'USER/HIDE_DELETE_DIALOG',
}

export const actions = {
  loadOrders: () => {
    return (dispath, getState) => {
      const { ids } = getState().user.orders
      if(ids.length > 0) {
        return null;
      }
      const endpoint = url.getOrders();
      return dispath(fetchOrders(endpoint))
    }   
  },
  setCurrentTab: (index) => ({
    type: types.SET_CURRENT_TAB,
    index
  }),
  removeOrder: () => {
    return (dispatch, getState) => {
      const {id} = getState().user.currentOrder
      if(id) {
        dispatch(deleteOrderRequest())
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            dispatch(deleteOrderSuccess(id))
            dispatch(orderActions.deleteOrder(id))
            resolve()
          }, 500)
        })
      }
    }
  },
  showDeleteDialog: (orderId) => ({
    type: types.SHOW_DELETE_DIALOG,
    orderId
  }),
  hideDeleteDialog: () => ({
    type: types.HIDE_DELETE_DIALOG,
  })
}

const deleteOrderRequest = () => ({
  type: types.DELETE_ORDERS_REQUEST
})

const deleteOrderSuccess = (orderId) => ({
  type: types.DELETE_ORDERS_SUCCESS,
  orderId
})

const fetchOrders = (endpoint) => ({
  [FETCH_DATA]: {
    types: [
      types.FETCH_ORDERS_REQUEST,
      types.FETCH_ORDERS_SUCCESS,
      types.FETCH_ORDERS_FAILURE
    ],
    endpoint,
    schema
  }
})

// reducers
const orders = (state = initialState.orders, action) => {
  switch(action.type) {
    case types.FETCH_ORDERS_REQUEST:
      return {...state, isFetching: true};
    case types.FETCH_ORDERS_SUCCESS:
    
      const toPayIds = action.response.ids.filter(id => 
        action.response.orders[id].type === TO_PAY_TYPE
      )
      const availableIds = action.response.ids.filter(id => 
        action.response.orders[id].type === AVAILABLE_TYPE
      )      
      const refundIds = action.response.ids.filter(id => 
        action.response.orders[id].type === REFUND_TYPE
      )
      return {
        ...state,
        isFetching: false,
        ids: state.ids.concat(action.response.ids),
        toPayIds: state.toPayIds.concat(toPayIds),
        availableIds: state.availableIds.concat(availableIds),
        refundIds: state.refundIds.concat(refundIds)
      };
    case orderTypes.DELETE_ORDER:
    case types.DELETE_ORDERS_SUCCESS:
      return {
        ...state,
        ids: removeOrderId(state, 'ids', action.orderId),
        toPayIds: removeOrderId(state, 'toPayIds', action.orderId),
        availableIds: removeOrderId(state, 'availableIds', action.orderId),
        refundIds: removeOrderId(state, 'refundIds', action.orderId),
      }
    default:
      return state;    
  }
}

const removeOrderId = (state, key, orderId) => {
  return state[key].filter(id => id !== orderId)
}

const currentTab = (state=initialState.currentTab, action) => {
  switch(action.type) {
    case types.SET_CURRENT_TAB:
      return action.index;
    default:
      return state;
  }
}

const currentOrder = (state = initialState.currentOrder, action) => {
  switch(action.type) {
    case types.SHOW_DELETE_DIALOG:
      return {
        ...state,
        id: action.orderId,
        isDeleting: true
      }
    case types.HIDE_DELETE_DIALOG:      
    case types.DELETE_ORDERS_FAILURE:
    case types.DELETE_ORDERS_SUCCESS:
      return initialState.currentOrder
    default:
      return state;
  }
}

const reducer = combineReducers({
  currentTab,
  orders,
  currentOrder
})

export default reducer;

// selectors
export const getCurrentTab = state => state.user.currentTab

export const getOrders = state => {
  const key = ['ids', 'toPayIds', 'availableIds', 'refundIds'][state.user.currentTab]
  return state.user.orders[key].map(id => {
    return getOrderById(state, id)
  })
}

export const getDeletingOrderId = state => {
  return state.user.currentOrder && state.user.currentOrder.isDeleting ? 
            state.user.currentOrder.id : null;
}