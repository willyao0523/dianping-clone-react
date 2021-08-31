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

import {   
  actions as commentActions
} from './entities/comments'

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
    isDeleting: false,
    isCommenting: false,
    comment: '',
    stars: 0,
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

  SHOW_COMMENT_AREA: 'USER/SHOW_COMMENT_AREA',
  HIDE_COMMENT_AREA: 'USER/HIDE_COMMENT_AREA',

  SET_COMMENT: 'USER/SET_COMMENT',
  SET_STARS: 'USER/SET_STARS',

  POST_COMMENT_REQUEST: 'USER/POST_COMMENT_REQUEST',
  POST_COMMENT_SUCCESS: 'USER/POST_COMMENT_SUCCESS',
  POST_COMMENT_FAILURE: 'USER/POST_COMMENT_FAILURE',  

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
  }),
  showCommentArea: orderId => ({
    type: types.SHOW_COMMENT_AREA,
    orderId
  }),
  hideCommentArea: () => ({
    type: types.HIDE_COMMENT_AREA,    
  }),
  setComment: (comment) => ({
    type: types.SET_COMMENT,
    comment
  }),
  setStars: stars => ({
    type: types.SET_STARS,
    stars
  }),
  submitComment: () => {
    return (dispatch, getState) => {
      dispatch(postCommentRequest())      
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const {currentOrder: {id, comment, stars}} = getState().user
          const commentObj = {
            id: +new Date(),
            stars,
            content: comment
          }
          dispatch(postCommentSuccess())
          dispatch(commentActions.addComment(commentObj))
          dispatch(orderActions.addComment(id, commentObj.id))
          resolve()
        }, 500)
      })
    }
  }
}

const postCommentRequest = () => ({
  type: types.POST_COMMENT_REQUEST
})

const postCommentSuccess = () => ({
  type: types.POST_COMMENT_SUCCESS
})

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
    case types.SHOW_COMMENT_AREA:
      return {
        ...state,
        id: action.orderId,
        isCommenting: true
      }          
    case types.HIDE_DELETE_DIALOG:      
    case types.HIDE_DELETE_DIALOG:
    case types.DELETE_ORDERS_FAILURE:
    case types.DELETE_ORDERS_SUCCESS:
    case types.POST_COMMENT_SUCCESS:
    case types.POST_COMMENT_FAILURE:
      return initialState.currentOrder
    case types.SET_COMMENT:
      return {...state, comment: action.comment}
    case types.SET_STARS:
      return {...state, stars: action.stars}
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

export const getCommentingOrderId = state => {
  return state.user.currentOrder && state.user.currentOrder.isCommenting ? 
            state.user.currentOrder.id : null;
}

export const getCurrentOrderComment = state => {
  return state.user.currentOrder.comment ? state.user.currentOrder.comment : ''
}

export const getCurrentOrderStars = state => {
  return state.user.currentOrder.stars ? state.user.currentOrder.stars : 0
}