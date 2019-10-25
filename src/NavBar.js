import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import getWeb3 from "./utils/getWeb3";
import TemporaryDrawer from "./NavDrawer";
import PrivateExchangeProxy from "./contracts/PrivateExchangeProxy.json";
import PrivateExchangeLogic from "./contracts/PrivateExchangeLogic.json";
import PrivateCompany from "./contracts/PrivateCompany.json";
import { useSnackbar } from "notistack";

import { Store } from "./Store";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    background: theme.palette.primary.main
  },
  title: {
    flexGrow: 1
  }
}));

export default function NavBar() {
  const classes = useStyles();
  const { state, dispatch } = useContext(Store);
  const { enqueueSnackbar } = useSnackbar();
  const connectWeb3 = async () => {
    try {
      //store web3 for contract interaction in whole app
      const web3 = await getWeb3();
      dispatch({
        type: "SET_WEB3",
        payload: web3
      });

      //store account for contract interaction in whole app
      const accounts = await web3.eth.getAccounts();
      dispatch({
        type: "SET_ACCOUNT",
        payload: accounts[0]
      });
      enqueueSnackbar("account initialized", { variant: "success" });

      //store networkId for contract interaction in whole app
      const networkId = await web3.eth.net.getId();
      dispatch({
        type: "SET_NETWORK",
        payload: networkId
      });
      //store contract
      const deployedProxy = PrivateExchangeProxy.networks[networkId];
      const instance = new web3.eth.Contract(
        PrivateExchangeLogic.abi,
        deployedProxy.address,
        {
          from: accounts[0]
        }
      );
      dispatch({
        type: "SET_CONTRACT",
        payload: instance
      });
      enqueueSnackbar("contract initialized", { variant: "success" });
      await exchangeDetails(web3, instance, accounts[0]);
      await userDetails(instance, accounts[0]);
    } catch (error) {
      // Catch any errors for any of the above operations.
      enqueueSnackbar("error with web3 connection", { variant: "error" });
    }
  };
  const userDetails = async (c, account) => {
    const _isAdmin = await c.methods.isOwner().call();
    dispatch({ type: "SET_USER_ISADMIN", payload: _isAdmin });
    const _balance = await c.methods.exchangeTokenBalance().call();
    dispatch({ type: "SET_USER_BALANCE", payload: _balance.toString() });
    const _numberCompanies = await c.methods.numberOfOwnedCompanies().call();
    dispatch({ type: "SET_USER_NUMBERCOMPANIES", payload: _numberCompanies });
    for (let i = 0; i < _numberCompanies; i++) {
      const ownedCompany = await c.methods.ownerCompanies(account, i).call();
      dispatch({ type: "ADD_USER_OWNEDCOMPANIES", payload: ownedCompany });
    }
  };
  const exchangeDetails = async (web3, c, account) => {
    dispatch({
      type: "SET_EXCHANGE_ADDRESS",
      payload: c.options.address
    });
    const _isOpen = await c.methods.isOpen().call();
    dispatch({ type: "SET_EXCHANGE_ISOPEN", payload: _isOpen });
    const _owner = await c.methods.owner().call();
    dispatch({ type: "SET_EXCHANGE_OWNER", payload: _owner });
    const _token = await c.methods.exchangeToken().call();
    const _tokenContract = new web3.eth.Contract(PrivateCompany.abi, _token, {
      from: account
    });
    dispatch({
      type: "SET_EXCHANGE_TOKEN",
      payload: _tokenContract
    });
    const _numberCompanies = await c.methods.numberOfListedCompanies().call();
    dispatch({
      type: "SET_EXCHANGE_NUMBERCOMPANIES",
      payload: _numberCompanies
    });
    for (let i = 0; i < _numberCompanies; i++) {
      const listedCompanyAddress = await c.methods.listedCompanies(i).call();
      const companyContract = new web3.eth.Contract(
        PrivateCompany.abi,
        listedCompanyAddress,
        {
          from: account
        }
      );
      const companyName = await companyContract.methods.name().call();
      const companySymbol = await companyContract.methods.symbol().call();
      const companyOwner = await companyContract.methods.owner().call();
      const companyPrice = await c.methods
        .listedCompanyPrices(companyContract.options.address)
        .call();
      const companySharesForSales = await companyContract.methods
        .allowance(companyOwner, c.options.address)
        .call();
      dispatch({
        type: "ADD_EXCHANGE_COMPANY",
        payload: {
          address: listedCompanyAddress,
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
    }
  };
  return (
    <React.Fragment>
      <AppBar position="static" className={classes.root}>
        <Toolbar>
          <TemporaryDrawer />
          <Typography variant="h6" className={classes.title} noWrap>
            Entanglement-Exchange
          </Typography>
          <Switch
            color="primary"
            checked={state.account !== null}
            disabled={state.account !== null}
            onChange={connectWeb3}
            aria-label="Connect"
          />
          <Typography variant="body2" noWrap>
            {state.account ? state.account : "Connect Web3"}
          </Typography>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}
