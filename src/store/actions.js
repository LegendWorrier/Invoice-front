// action - customization reducer
export const SET_MENU = '@customization/SET_MENU';
export const MENU_TOGGLE = '@customization/MENU_TOGGLE';
export const MENU_OPEN = '@customization/MENU_OPEN';
export const SET_FONT_FAMILY = '@customization/SET_FONT_FAMILY';
export const SET_BORDER_RADIUS = '@customization/SET_BORDER_RADIUS';
export const SET_AUTH = '@customization/SET_AUTH';
export const SET_USER_DATA = '@customization/SET_USER_DATA';
export const SET_SOCKET = '@customization/SET_SOCKET';

export const authLogin = (userData) => ({
    type: SET_AUTH,
    payload: userData,  
  });

export const setUserData = (userData) => ({
type: SET_USER_DATA,
payload: userData,  
});

export const setSocket = (socket) => ({
  type: SET_SOCKET,
  payload: socket,
})