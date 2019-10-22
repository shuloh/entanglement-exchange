import React from "react";

export const Store = React.createContext();

const initialState = {
  web3: null,
  network: null,
  account: null,
  contract: null,

  isAdmin: false,
  sideBarOpen: false,
  listedCompanies: { ExchangeToken: { name: "COMPANY-TEST", symbol: "COYT" } }
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_WEB3":
      return { ...state, web3: action.payload };
    case "SET_NETWORK":
      return { ...state, network: action.payload };
    case "SET_ACCOUNT":
      return { ...state, account: action.payload };
    case "SET_CONTRACT":
      return { ...state, contract: action.payload };
    case "SIDE_DRAWER":
      return { ...state, sideBarOpen: action.payload };
    case "ADD_LISTEDCOMPANY":
      return {
        ...state,
        listedCompanies: {
          ...state.listedCompanies,
          [action.payload.key]: action.payload.value
        }
      };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
