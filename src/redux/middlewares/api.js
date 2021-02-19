import { get } from "../../utils/requests"

// the identification of the actions need to be processed
export const FETCH_DATA = 'FETCH_DATA'

export default store => next => action => {
  const callAPI = action[FETCH_DATA]
  if(typeof callAPI === 'undefined') {
    return next(action)
  }

  const { endpoint, schema, types } = callAPI
  if(typeof endpoint !== 'string') {
    throw new Error('endpoint should be a string')      
  }
  if(!schema) {
    throw new Error('schema is required')      
  }
  if(!Array.isArray(types) && types.length !== 0) {
    throw new Error('a array including three action types is required')
  }
  if(!types.every(type => typeof type === 'string')) {
    throw new Error('action type should be a string')
  }

  const actionWith = data => {
    const finalAction = {...action, ...data}
    delete finalAction[FETCH_DATA]
    return finalAction
  }

  const [requestType, successType, failureType] = types

  next(actionWith({type: requestType}))
  return fetchData(endpoint, schema).then(
    response => next(actionWith({
      type: successType,
      response
    })),
    error => next(actionWith({
      type: failureType,
      error: error.message || "failed to get the data"
    }))
  )
}

// fetch data execution
const fetchData = (endpoint, schema) => {
  return get(endpoint).then(data => {
    return normalizeData(data, schema)
  })
}

// normalize data
const normalizeData = (data, schema) => {
  const  { id, name } = schema
  let kvObj = {}
  let ids = []
  if(Array.isArray(data)) {
    data.forEach(item => {
      kvObj[item[id]] = item
      ids.push(item[id])
    })
  } else {
    kvObj[data[id]] = data
    ids.push(data[id])
  }
  return {
    [name]: kvObj,
    ids
  }
}