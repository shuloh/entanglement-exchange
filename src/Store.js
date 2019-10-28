import React from "react";

export const Store = React.createContext();

const initialState = {
  sideBarOpen: false,

  web3: null,
  network: null,
  account: null,
  contract: null,

  userIsAdmin: false,
  userBalance: "0",
  userStaked: "0",
  userNumberCompanies: 0,
  userOwnedCompanies: {},

  exchangeAddress: "",
  exchangeIsOpen: false,
  exchangeOwner: "",
  exchangeToken: "",
  exchangeNumberCompanies: 0,
  exchangeCompanies: {}
};

function reducer(state, action) {
  switch (action.type) {
    case "SIDE_DRAWER":
      return { ...state, sideBarOpen: action.payload };
    case "ADMINPANEL_OPEN":
      return { ...state, adminPanelOpen: action.payload };
    case "SET_WEB3":
      return { ...state, web3: action.payload };
    case "SET_NETWORK":
      return { ...state, network: action.payload };
    case "SET_ACCOUNT":
      return { ...state, account: action.payload };
    case "SET_CONTRACT":
      return { ...state, contract: action.payload };
    case "SET_USER_ISADMIN":
      return { ...state, userIsAdmin: action.payload };
    case "SET_USER_BALANCE":
      return { ...state, userBalance: action.payload };
    case "SET_USER_STAKED":
      return { ...state, userStaked: action.payload };
    case "GET_USER_BALANCE":
      return state.userBalance;
    case "SET_USER_NUMBERCOMPANIES":
      return { ...state, userNumberCompanies: action.payload };
    case "ADD_USER_OWNEDCOMPANY":
      return {
        ...state,
        userOwnedCompanies: {
          ...state.exchangeCompanies,
          [action.payload]: true
        }
      };
    case "REMOVE_USER_OWNEDCOMPANY":
      return {
        ...state,
        userOwnedCompanies: {
          ...state.exchangeCompanies,
          [action.payload]: false
        }
      };
    case "SET_EXCHANGE_ADDRESS":
      return { ...state, exchangeAddress: action.payload };
    case "SET_EXCHANGE_ISOPEN":
      return { ...state, exchangeIsOpen: action.payload };
    case "SET_EXCHANGE_OWNER":
      return { ...state, exchangeOwner: action.payload };
    case "SET_EXCHANGE_TOKEN":
      return { ...state, exchangeToken: action.payload };
    case "SET_EXCHANGE_NUMBERCOMPANIES":
      return { ...state, exchangeNumberCompanies: action.payload };
    case "SET_EXCHANGE_COMPANIES":
      return {
        ...state,
        exchangeCompanies: action.payload
      };
    case "ADD_EXCHANGE_COMPANY":
      return {
        ...state,
        exchangeCompanies: {
          ...state.exchangeCompanies,
          [action.payload.address]: action.payload.descr
        }
      };
    case "UPDATE_EXCHANGE_COMPANY":
      const companyAddress = action.payload.address;
      return {
        ...state,
        exchangeCompanies: {
          ...state.exchangeCompanies,
          [companyAddress]: {
            ...state.exchangeCompanies[companyAddress],
            [action.payload.key]: action.payload.value
          }
        }
      };

    case "SET_ADMIN_OPENMODE":
      return { ...state, transactAdminOpenMode: action.payload };
    case "SET_USER_NEWCOMPANY":
      switch (action.subtype) {
        case "name":
          return { ...state, transactNewCompanyName: action.payload };
        case "symbol":
          return { ...state, transactNewCompanySymbol: action.payload };
        case "price":
          return { ...state, transactNewCompanyPrice: action.payload };
        default:
          return state;
      }
    case "CLEAR_USER_NEWCOMPANY":
      return {
        ...state,
        transactNewCompanyName: "",
        transactNewCompanySymbol: "",
        transactNewCompanyPrice: 1
      };
    case "SET_USER_BUYEE":
      return { ...state, transactBuyEE: action.payload };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
