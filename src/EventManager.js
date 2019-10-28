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
        const companyTotalSupply = await companyContract.methods
          .totalSupply()
          .call();
        const _ownedShares = await companyContract.methods
          .balanceOf(state.contract.options.from)
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
              totalSupply: companyTotalSupply,
              ownedShares: _ownedShares,
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

    if (latestState.current.contract) {
      latestState.current.contract.events
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
  }, [state.contract, dispatch, enqueueSnackbar]);
  useEffect(() => {
    const userBalanceUpdated = async () => {
      const _oldBalance = Object.assign(latestState.current.userBalance);
      const _balance = await latestState.current.contract.methods
        .exchangeTokenBalance()
        .call();
      const _oldBalanceDisplay = latestState.current.web3.utils.fromWei(
        _oldBalance.toString()
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
    const userAllowanceUpdated = async () => {
      const _oldAllowance = Object.assign(latestState.current.userStaked);
      const _allowance = await latestState.current.contract.methods
        .exchangeTokenStaked()
        .call();
      const _oldDisplay = latestState.current.web3.utils.fromWei(
        _oldAllowance.toString()
      );
      const _newDisplay = latestState.current.web3.utils.fromWei(_allowance);
      dispatch({ type: "SET_USER_STAKED", payload: _allowance });
      enqueueSnackbar(
        `Updated user staked from ${_oldDisplay} to ${_newDisplay}`,
        { variant: "success" }
      );
    };
    if (latestState.current.exchangeToken) {
      latestState.current.exchangeToken.events
        .allEvents()
        .on("data", event => {
          switch (event.event) {
            case "Transfer":
              if (
                event.returnValues.from === latestState.current.account ||
                event.returnValues.to === latestState.current.account
              ) {
                userBalanceUpdated();
              }
              break;
            case "Approval":
              if (event.returnValues.owner === latestState.current.account) {
                userAllowanceUpdated();
              }
              break;
            default:
              break;
          }
        })
        .on("error", console.error);
    }
  }, [state.exchangeToken, dispatch, enqueueSnackbar]);
  return null;
}
