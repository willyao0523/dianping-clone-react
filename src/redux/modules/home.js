import { get } from "../../utils/requests"
import url from "../../utils/url"
import { FETCH_DATA } from "../middlewares/api"

export const types = {
  FETCH_LIKES_REQUEST: "HOME/FETCH_LIKES_REQUEST", // fetching recommendation
  FETCH_LIKES_SUCCESS: "HOME/FETCH_LIKES_SUCCESS", // fetching success
  FETCH_LIKES_FAILURE: "HOME/FETCH_LIKES_FAILURE", // fetching fail
}

export const actions = {
  loadLikes: () => {
    return (dispatch, getState) => {
      const endpoint = url.getProductList(0, 10)
      return dispatch(fetchLikes(endpoint))
    }
  }
  // loadLikes: () => {
  //   return (dispatch, getState) => {
  //     dispatch(fetchLikesRequest)
  //     return get(url.getProductList(0, 10)).then(
  //       data => {
  //         dispatch(fetchLikesSuccess(data));          
  //       },
  //       error => {
  //         dispatch(fetchLikesFailure(error));
  //       }
  //     )
  //   }
  // }
}

const fetchLikes = (endpoint, params) => ({
  [FETCH_DATA]: {
    types: [
      type.FETCH_LIKES_REQUEST,
      type.FETCH_LIKES_SUCCESS,
      type.FETCH_LIKES_FAILURE
    ],
    endpoint,
    schema
  },
  params,
})

const fetchLikesRequest = () => ({
  type: types.FETCH_LIKES_REQUEST
})

const fetchLikesSuccess = (data) => ({
  type: types.FETCH_LIKES_SUCCESS,
  data
})

const fetchLikesFailure = (error) => ({
  type: types.FETCH_LIKES_FAILURE,
  error
})

const reducer = (state = {}, action) => {
  switch (action.type) {
    case types.FETCH_LIKES_REQUEST:
      //todo      
    case types.FETCH_LIKES_SUCCESS:
      //todo          
    case types.FETCH_LIKES_SUCCESS:
      //todo          
    default:
      return state;    
  }  
}

export default reducer;