import { useContext, useEffect, useRef } from "react";
import { useSnackbar } from "notistack";

import { Store } from "./Store";
export default function EventManager() {
  const { state, dispatch } = useContext(Store);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (state.contract) {
      state.contract.events
        .allEvents()
        .on("data", event => {
          switch (event.event) {
            case "ExchangeOpened":
              exchangeOpened();
              break;
            case "ExchangeClosed":
              exchangeClosed();
              break;
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
        .on("data", event => {})
        .on("error", console.error);
    }
  }, [state.exchangeToken]);
  const exchangeOpened = async () => {
    console.log("OPEN");
    enqueueSnackbar("EXCHANGE OPENED", {});
    dispatch({ type: "SET_EXCHANGE_ISOPEN", payload: true });
  };
  const exchangeClosed = async () => {
    enqueueSnackbar("EXCHANGE CLOSED", {});
    dispatch({ type: "SET_EXCHANGE_ISOPEN", payload: false });
  };
  const userBalanceUpdated = async () => {};
  return null;
}
