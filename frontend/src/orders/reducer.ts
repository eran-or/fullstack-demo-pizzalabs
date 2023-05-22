import {IOrder, IAction} from './types'

export const reducer = (state: IOrder[], action: IAction): IOrder[] => {
    let newState;
    switch (action.type) {
      case 'ADD_ORDER':
        newState = [...state, action.payload];
        break;
      case 'UPDATE_ORDER':
        newState = state.map(order => order.orderId === action.payload.orderId ? action.payload : order);
        break;
      case 'FETCH_ORDERS':
        newState = action.payload;
        break;
      default:
        return state;
    }
    console.log('New state:', newState);
    return newState;
  };
  