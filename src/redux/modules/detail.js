import url from '../../utils/url'
import {FETCH_DATA} from '../middlewares/api'
import {schema as productSchema, getProductDetail} from './entities/products'
import {schema as shopSchema} from './entities/shops'

export const types = {
  // 获取产品详情的action types
  FETCH_PRODUCT_DETAIL_REQUEST: 'DETAIL/FETCH_PRODUCT_DETAIL_REQUEST',
  FETCH_PRODUCT_DETAIL_SUCCESS: 'DETAIL/FETCH_PRODUCT_DETAIL_SUCCESS',
  FETCH_PRODUCT_DETAIL_FAILURE: 'DETAIL/FETCH_PRODUCT_DETAIL_FAILURE',
  // 获取商铺信息的
  FETCH_SHOP_REQUEST: 'DETAIL/FETCH_SHOP_REQUEST',
  FETCH_SHOP_SUCCESS: 'DETAIL/FETCH_SHOP_SUCCESS',
  FETCH_SHOP_FAILURE: 'DETAIL/FETCH_SHOP_FAILURE',
}

export const actions = {
  // 获取商品信息
  loadProductDetail: id => {
    return (dispatch, getState) => {
      const product = getProductDetail(getState, getState(), id)
      if(product) {
        return dispatch(fetchProductDetailSuccess(id))
      }
      const endpoint = url.getProductDetail(id)
      return dispatch(fetchProductDetail(endpoint, id))
    }
  },
  // 获取店铺信息
  loadShopById: id => {
    return (dispatch, getState) => {
      const shop = getShopById(getState, getState(), id)
      if(shop) {
        return dispatch(fetchShopSuccess(id))
      }
      const endpoint = url.getShopById(id)
      return dispatch(fetchShopById(endpoint, id))
    }
  }
}

const fetchProductDetail = (endpoint, id) => ({
  [FETCH_DATA]: {
    types: [
      types.FETCH_PRODUCT_DETAIL_REQUEST,
      types.FETCH_PRODUCT_DETAIL_SUCCESS,
      types.FETCH_PRODUCT_DETAIL_FAILURE
    ],
    endpoint,
    schema: productSchema    
  },
  id
})

const fetchShopById = (endpoint, id) => ({
  [FETCH_DATA]: {
    types: [
      types.FETCH_SHOP_REQUEST,
      types.FETCH_SHOP_SUCCESS,
      types.FETCH_SHOP_FAILURE
    ],
    endpoint,
    schema: shopSchema
  },
  id
})

const fetchProductDetailSuccess = (id) => ({
  type: types.FETCH_PRODUCT_DETAIL_SUCCESS,
  id
})

const fetchShopSuccess = (id) => ({
  type: types.FETCH_SHOP_SUCCESS,
  id
})

const initialState = {
  product: {
    isFetching: false,
    id: null,
  },
  relatedShop: {
    isFetching: false,
    id: null
  }
}



const reducer = (state = {}, action) => {
  return state;
}

export default reducer;