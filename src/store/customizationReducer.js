// project imports
import config from 'config';

// action - state management
import * as actionTypes from './actions';
import serverconfig from '../config';
import io from 'socket.io-client';

export const initialState = {
  isOpen: [], // for active default menu
  defaultId: 'default',
  fontFamily: config.fontFamily,
  borderRadius: config.borderRadius,
  opened: true,
  auth: {},
  userData: [],
  error: ['ddd'],
  socket: io(`http://${serverconfig.server}:8888`)
  
};

// ==============================|| CUSTOMIZATION REDUCER ||============================== //

const customizationReducer = (state = initialState, action) => {
  let id;
  switch (action.type) {

    case actionTypes.MENU_OPEN:
      id = action.id;
      return {
        ...state,
        isOpen: [id]
      };
    case actionTypes.SET_AUTH:
      console.log('typeactiontypes',state, action.payload)
      return {
        ...state,
        auth: action.payload
      };

    case actionTypes.SET_USER_DATA:
      console.log('SET_USER_DATA',state, action.payload)
      return {
        ...state,
        userData: action.payload
      };
    case actionTypes.SET_MENU:
      return {
        ...state,
        opened: action.opened
      };
    case actionTypes.SET_FONT_FAMILY:
      return {
        ...state,
        fontFamily: action.fontFamily
      };
    case actionTypes.SET_BORDER_RADIUS:
      return {
        ...state,
        borderRadius: action.borderRadius
      };
    default:
      return state;
  }
};

export default customizationReducer;
