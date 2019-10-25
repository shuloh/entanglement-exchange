import PrivateCompany from "./contracts/PrivateCompany.json";
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
    const exchangeOpened = async () => {
      enqueueSnackbar("Exchange Opened", { variant: "success" });
      dispatch({ type: "SET_EXCHANGE_ISOPEN", payload: true });
    };
    const exchangeClosed = async () => {
      enqueueSnackbar("Exchange Closed", { variant: "error" });
      dispatch({ type: "SET_EXCHANGE_ISOPEN", payload: false });
    };
    const companyListed = async (owner, newCompany) => {
      try {
        enqueueSnackbar("New Company Listed", {
          variant: owner === latestState.current.account ? "success" : "default"
        });
        const _numberCompanies = await latestState.current.contract.methods
          .numberOfListedCompanies()
          .call();
        dispatch({
          type: "SET_EXCHANGE_NUMBERCOMPANIES",
          payload: _numberCompanies
        });
        const companyContract = new latestState.current.web3.eth.Contract(
          PrivateCompany.abi,
          newCompany,
          {
            from: latestState.current.account
          }
        );
        const companyName = await companyContract.methods.name().call();
        const companySymbol = await companyContract.methods.symbol().call();
        const companyOwner = owner;
        const companyPrice = await latestState.current.contract.methods
          .listedCompanyPrices(newCompany)
          .call();
        const exchangeAddress = latestState.current.exchangeAddress;
        const companySharesForSales = await companyContract.methods
          .allowance(companyOwner, exchangeAddress)
          .call();
        dispatch({
          type: "ADD_EXCHANGE_COMPANY",
          payload: {
            address: newCompany,
            descr: {
              name: companyName,
              symbol: companySymbol,
              owner: companyOwner,
              sharesForSale: companySharesForSales,
              pricePerShare: companyPrice,
              contract: companyContract
            }
          }
        });
        owner === latestState.current.account &&
          dispatch({
            type: "ADD_USER_OWNEDCOMPANY",
            payload: newCompany
          });
      } catch (err) {
        console.error(err);
      }
    };

    if (state.contract) {
      state.contract.events
        .allEvents()
        .on("data", event => {
          switch (event.event) {
            case "ExchangeOpened":
              return exchangeOpened();
            case "ExchangeClosed":
              return exchangeClosed();
            case "CompanyListed":
              return companyListed(
                event.returnValues.owner,
                event.returnValues.company
              );
            default:
              return null;
          }
        })
        .on("error", console.error);
    }
  }, [state.contract, state.account, dispatch, enqueueSnackbar]);
  useEffect(() => {
    const userBalanceUpdated = async () => {
      const _oldBalance = latestState.current.userBalance;
      const _balance = await latestState.current.contract.methods
        .exchangeTokenBalance()
        .call();
      const _oldBalanceDisplay = latestState.current.web3.utils.fromWei(
        _oldBalance
      );
      const _newBalanceDisplay = latestState.current.web3.utils.fromWei(
        _balance
      );
      dispatch({ type: "SET_USER_BALANCE", payload: _balance });
      enqueueSnackbar(
        `Updated user balance from ${_oldBalanceDisplay} to ${_newBalanceDisplay}`,
        { variant: "success" }
      );
    };
    if (state.exchangeToken && state.account) {
      state.exchangeToken.events
        .allEvents()
        .on("data", event => {
          switch (event.event) {
            case "Transfer":
              if (
                event.returnValues.from === state.account ||
                event.returnValues.to === state.account
              ) {
                return userBalanceUpdated();
              }
              return null;
            default:
              return null;
          }
        })
        .on("error", console.error);
    }
  }, [state.exchangeToken, state.account, dispatch, enqueueSnackbar]);
  return null;
}
