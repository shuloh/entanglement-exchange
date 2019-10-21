import React from "react";

export const Store = React.createContext();

const initialState = {
  network: null,
  account: null,
  contract: null,

  sideBarOpen: false,
  listedCompanies: [],
  nListedCompanies: 0
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_NETWORK":
      return { ...state, network: action.payload };
    case "SET_ACCOUNT":
      return { ...state, account: action.payload };
    case "SET_CONTRACT":
      return { ...state, contract: action.payload };
    case "SIDE_DRAWER":
      return { ...state, sideBarOpen: action.payload };
    case "SET_NLISTEDCOMPANIES":
      return { ...state, nListedCompanies: action.payload };
    case "SET_LISTEDCOMPANIES":
      return { ...state, listedCompanies: action.payload };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
