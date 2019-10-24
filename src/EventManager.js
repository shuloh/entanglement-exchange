import { useContext, useEffect, useRef } from "react";
import { useSnackbar } from "notistack";

import { Store } from "./Store";
export default function EventManager() {
  const { state, dispatch } = useContext(Store);
  const { enqueueSnackbar } = useSnackbar();
  let latestState = useRef(state);
  useEffect(() => {
    latestState.current = state;
  }, [state]);
  useEffect(() => {
    if (state.contract) {
      state.contract.events
        .allEvents()
        .on("data", event => {
          switch (event.event) {
            case "ExchangeOpened":
              return exchangeOpened();
            case "ExchangeClosed":
              return exchangeClosed();
            default:
              return null;
          }
        })
        .on("error", console.error);
    }
  }, [state.contract]);
  useEffect(() => {
    if (state.exchangeToken) {
      state.exchangeToken.events
        .allEvents()
        .on("data", event => {
          switch (event.event) {
            case "Transfer":
              if (
                event.returnValues.from === state.account ||
                event.returnValues.to === state.account
              ) {
                userBalanceUpdated();
              }
            default:
              return null;
          }
        })
        .on("error", console.error);
    }
  }, [state.exchangeToken]);

  const exchangeOpened = async () => {
    console.log("OPEN");
    enqueueSnackbar("EXCHANGE OPENED", { variant: "success" });
    dispatch({ type: "SET_EXCHANGE_ISOPEN", payload: true });
  };
  const exchangeClosed = async () => {
    enqueueSnackbar("EXCHANGE CLOSED", { variant: "error" });
    dispatch({ type: "SET_EXCHANGE_ISOPEN", payload: false });
  };
  const userBalanceUpdated = async () => {
    const _oldBalance = latestState.current.userBalance;
    const _balance = await latestState.current.contract.methods
      .exchangeTokenBalance()
      .call();
    const _oldBalanceDisplay = latestState.current.web3.utils.fromWei(
      _oldBalance
    );
    const _newBalanceDisplay = latestState.current.web3.utils.fromWei(_balance);
    dispatch({ type: "SET_USER_BALANCE", payload: _balance });
    enqueueSnackbar(
      `Updated user balance from ${_oldBalanceDisplay} to ${_newBalanceDisplay}`,
      { variant: "success" }
    );
  };
  return null;
}
