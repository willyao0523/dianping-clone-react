import url from '../../utils/url'
import {FETCH_DATA} from '../middlewares/api'
import {schema as keywordSchema, getKeywordById} from './entities/keywords'
import {schema as shopSchema, getShopById} from './entities/shops'
import {combineReducers} from "redux"



export const types = {
  // 获取热门关键词
  FETCH_PUPULAR_KEYWORD_REQUEST : "SEARCH/FETCH_PUPULAR_KEYWORD_REQUEST",
  FETCH_PUPULAR_KEYWORD_SUCCESS : "SEARCH/FETCH_PUPULAR_KEYWORD_SUCCESS",
  FETCH_PUPULAR_KEYWORD_FAILURE : "SEARCH/FETCH_PUPULAR_KEYWORD_FAILURE",
  // 根据输入的文本获取相关的关键词
  FETCH_RELATED_KEYWORD_REQUEST : "SEARCH/FETCH_RELATED_KEYWORD_REQUEST",
  FETCH_RELATED_KEYWORD_SUCCESS : "SEARCH/FETCH_RELATED_KEYWORD_SUCCESS",
  FETCH_RELATED_KEYWORD_FAILURE : "SEARCH/FETCH_RELATED_KEYWORD_FAILURE",
  // 设置当前输入
  SET_INPUT_TEXT: "SEARCH/SET_INPUT_TEXT",
  CLEAR_INPUT_TEXT: "SEARCH/CLEAR_INPUT_TEXT",
  // 设置搜索历史记录
  ADD_HISTORY_KEYWORD: "SEARCH/ADD_HISTORY_KEYWORD",
  CLEAR_HISTORY_KEYWORDS: "SEARCH/CLEAR_HISTORY_KEYWORDS",
  // 根据关键词查询结果
  FETCH_SHOPS_REQUEST : "SEARCH/FETCH_SHOPS_REQUEST",
  FETCH_SHOPS_SUCCESS : "SEARCH/FETCH_SHOPS_SUCCESS",
  FETCH_SHOPS_FAILURE : "SEARCH/FETCH_SHOPS_FAILURE",
}

const initialState = {
  inputText: '',
  popularKeywords: {
    isFetching: false,
    ids: []
  },
  /**
   * {
   *  '火锅': {
   *      isFetching: false,
   *      ids: []
   *    }
   * }
   */
  relatedKeywords: {

  },
  historyKeywords: [],
  /**
   * {
   *  'keyword': {
   *    isFetching: false,
   *    ids: []
   *  }
   * }
   */
  searchedShopsByKeyword: {}
}


export const actions = {
  // 获取热门关键词
  loadPopularKeywords: () => {
    return (dispatch, getState) => {
      const {ids} = getState().search.popularKeywords;
      if(ids.length > 0) {
        return null;
      }
      const endpoint = url.getPopularKeywords();
      return dispatch(fetchPopularKeywords(endpoint));
    }
  },
  // 获取相关关键词
  loadRelatedKeywords: (text) => {
    return (dispatch, getState) => {
      const {relatedKeywords} = getState().search;
      if(relatedKeywords[text]) {
        return null;
      }
      const endpoint = url.getRelatedKeywords(text);
      
      return dispatch(
        fetchRelatedKeywords(text, endpoint)
        );
    } 
  },  
  // 获取查询到的相关商店
  loadRelatedShops: keyword => {
    return (dispatch, getState) => {
      const {searchedShopsByKeyword} = getState().search;
      if(searchedShopsByKeyword[keyword]) {
        return null
      }
      const endpoint = url.getRelatedShops(keyword)
      return dispatch(fetchRelatedShops(keyword, endpoint))
    }
    
  },
  // 搜索框文本相关的actions
  setInputText: text => ({
    type: types.SET_INPUT_TEXT,
    text
  }),
  clearInputText: () => ({
    type: types.CLEAR_INPUT_TEXT
  }),
  // 历史查询记录相关的action
  addHistoryKeywords: keywordId => ({
    type: types.ADD_HISTORY_KEYWORD,
    text: keywordId
  }),
  clearHistoryKeywords: () => ({
    type: types.CLEAR_HISTORY_KEYWORDS
  })
} 

const fetchPopularKeywords = endpoint => ({
  [FETCH_DATA]: {
    types: [
      types.FETCH_PUPULAR_KEYWORD_REQUEST,
      types.FETCH_PUPULAR_KEYWORD_SUCCESS,
      types.FETCH_PUPULAR_KEYWORD_FAILURE
    ],
    endpoint,
    schema: keywordSchema
  }
  
})

const fetchRelatedKeywords = (text, endpoint) => ({
  [FETCH_DATA]: {
    types: [
      types.FETCH_RELATED_KEYWORD_REQUEST,
      types.FETCH_RELATED_KEYWORD_SUCCESS,
      types.FETCH_RELATED_KEYWORD_FAILURE
    ],
    endpoint,
    schema: keywordSchema
  },
  text
})

const fetchRelatedShops = (text, endpoint) => ({
  [FETCH_DATA]: {
    types: [
      types.FETCH_SHOPS_REQUEST,
      types.FETCH_SHOPS_SUCCESS,
      types.FETCH_SHOPS_FAILURE
    ], 
    endpoint,
    schema: shopSchema
  },
  text
})

// reducers
const popularKeywords = (state = initialState.popularKeywords, action) => {
  switch (action.type) {
    case types.FETCH_PUPULAR_KEYWORD_REQUEST:
      return {...state, isFetching: true};
    case types.FETCH_PUPULAR_KEYWORD_SUCCESS:
      return {
        ...state, 
        isFetching: false,
        ids: state.ids.concat(action.response.ids)
      }
    case types.FETCH_PUPULAR_KEYWORD_FAILURE:
      return {...state, isFetching: false}
    default:
      return state  
  }
}

const relatedKeywords = (state = initialState.relatedKeywords, action) => {
  switch (action.type) {
    case types.FETCH_RELATED_KEYWORD_REQUEST:      
    case types.FETCH_RELATED_KEYWORD_SUCCESS:      
    case types.FETCH_RELATED_KEYWORD_FAILURE:
      return {
        ...state,
        [action.text]: relatedKeywordsByText(state[action.text], action)
      }    
    default:
      return state;  
  }
}

const relatedKeywordsByText = (state = {isFetching: false, ids: []}, action) => {
  switch (action.type) {
    case types.FETCH_RELATED_KEYWORD_REQUEST:
      return {...state, isFetching: true}
    case types.FETCH_RELATED_KEYWORD_SUCCESS:
      return {...state, isFetching: false, ids: state.ids.concat(action.response.ids)}
    case types.FETCH_RELATED_KEYWORD_FAILURE:
      return {...state, isFetching: false}  
    default:
      return state;  
  }
}

const searchedShopsByKeyword = (state = initialState.searchedShopsByKeyword, action) => {
  switch (action.type) {
    case types.FETCH_SHOPS_REQUEST:      
    case types.FETCH_SHOPS_SUCCESS:      
    case types.FETCH_SHOPS_FAILURE:
      return {
        ...state,
        [action.text]: searchShops(state[action.text], action)
      }    
    default:
      return state;  
  }
}

const searchShops = (state = {isFetching: false, ids: []}, action) => {
  switch (action.type) {
    case types.FETCH_SHOPS_REQUEST:
      return {...state, isFetching: true}
    case types.FETCH_SHOPS_SUCCESS:
      return {...state, isFetching: false, ids: action.response.ids}
    case types.FETCH_SHOPS_FAILURE:
      return {...state, isFetching: false}  
    default:
      return state;  
  }
}

const inputText = (state = initialState.inputText, action) => {
  switch (action.type) {
    case types.SET_INPUT_TEXT:
      return action.text;
    case  types.CLEAR_INPUT_TEXT:
      return "";
    default:
      return state;
  }
}

const historyKeywords = (state = initialState.historyKeywords, action) => {
  switch (action.type) {
    case types.ADD_HISTORY_KEYWORD:
      const data = state.filter(item => {
        if(item !== action.text) {
          return true;
        }
        return false;
      })
      return [action.text, ...data]
    case types.CLEAR_HISTORY_KEYWORDS:
      return []
    default:
      return state;    
  }

}

const reducer = combineReducers({
  popularKeywords,
  relatedKeywords,
  inputText,
  historyKeywords,
  searchedShopsByKeyword
})

export default reducer;

// selector
export const getPopularKeywords = state => {
  return state.search.popularKeywords.ids.map(id => {
    return getKeywordById(state, id)
  })
}

export const getRelatedKeywords = state => {
  const text = state.search.inputText;
  if(!text || text.trim().length === 0) {
    return []
  }
  const relatedKeywords = state.search.relatedKeywords[text]
  if(!relatedKeywords) {
    return []
  }
  return relatedKeywords.ids.map(id => {
    return getKeywordById(state, id)
  })
}

export const getInputText = state => {
  return state.search.inputText
}


export const getHistoryKeywords = state => {
  return state.search.historyKeywords.map(id => {
    return getKeywordById(state, id)
  })
}

export const getSeachedShops = state => {
  const keywordId = state.search.historyKeywords[0]
  if(!keywordId) {
    return []
  }
  const shops = state.search.searchedShopsByKeyword[keywordId]
  return shops.ids.map(id => {
    return getShopById(state, id)
  })
}

export const getCurrentKeyword = state => {
  const keywordId = state.search.historyKeywords[0]
  if(!keywordId) {
    return ""
  }
  return getKeywordById(state, keywordId).keyword
}