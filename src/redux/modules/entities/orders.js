import createReducer from '../../../utils/createReducer'

export const schema = {
  name: "orders",
  id: "id",
}

export const USED_TYPE = 1;
export const TO_PAY_TYPE = 2;
export const AVAILABLE_TYPE = 3;
export const REFUND_TYPE = 4;

const reducer = createReducer(schema.name)

export default reducer;