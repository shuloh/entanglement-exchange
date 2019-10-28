import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import getWeb3 from "./utils/getWeb3";
import TemporaryDrawer from "./NavDrawer";
import PrivateExchangeProxy from "./contracts/PrivateExchangeProxy.json";
import PrivateExchangeLogic from "./contracts/PrivateExchangeLogic.json";
import PrivateCompany from "./contracts/PrivateCompany.json";
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import indigo from "@material-ui/core/colors/indigo";
import { Store } from "./Store";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    background: theme.palette.primary.main
  },
  title: {
    flexGrow: 1
  },
  label: {
    noWrap: true
  },
  balanceBar: {
    backgroundColor: indigo[900],
    padding: theme.spacing(1, 3, 1, 3)
  }
}));

export default function NavBar() {
  const classes = useStyles();
  const { state, dispatch } = useContext(Store);
  const { enqueueSnackbar } = useSnackbar();
  const storeWeb3Contract = async web3 => {
    try {
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      dispatch({
        type: "SET_ACCOUNT",
        payload: account
      });
      enqueueSnackbar("Account initialized", { variant: "success" });
      const networkId = await web3.eth.net.getId();
      dispatch({
        type: "SET_NETWORK",
        payload: networkId
      });
      const deployedProxy = PrivateExchangeProxy.networks[networkId];
      const instance = new web3.eth.Contract(
        PrivateExchangeLogic.abi,
        deployedProxy.address,
        {
          from: account
        }
      );
      dispatch({
        type: "SET_CONTRACT",
        payload: instance
      });
      enqueueSnackbar("Contract initialized", { variant: "success" });
      await exchangeDetails(web3, instance, account);
      await userDetails(instance, account);
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Error with contract initialization", {
        variant: "error"
      });
    }
  };
  const connectWeb3 = async () => {
    try {
      //store web3 for contract interaction in whole app
      const web3 = await getWeb3();
      if (window.ethereum) {
        window.ethereum.on("accountsChanged", accounts => {
          window.location.reload(true);
        });
        window.ethereum.on("networkChanged", accounts => {
          window.location.reload(true);
        });
      }
      dispatch({
        type: "SET_WEB3",
        payload: web3
      });
      storeWeb3Contract(web3);
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Error with web3 connection", { variant: "error" });
    }
  };
  const userDetails = async (c, account) => {
    const _isAdmin = await c.methods.isOwner().call();
    dispatch({ type: "SET_USER_ISADMIN", payload: _isAdmin });
    const _staked = await c.methods.exchangeTokenStaked().call();
    dispatch({ type: "SET_USER_STAKED", payload: _staked.toString() });
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
      const companyTotalSupply = await companyContract.methods
        .totalSupply()
        .call();
      const _ownedShares = await companyContract.methods
        .balanceOf(account)
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
            totalSupply: companyTotalSupply,
            ownedShares: _ownedShares,
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
          <FormControlLabel
            classes={{
              label: classes.label // class name, e.g. `classes-nesting-label-x`
            }}
            control={
              <Switch
                color="default"
                checked={state.account !== null}
                disabled={state.account !== null}
                onChange={connectWeb3}
                aria-label="Connect"
              />
            }
            label={state.account ? state.account : "Connect web3"}
          />
        </Toolbar>
      </AppBar>
      <Paper className={classes.balanceBar}>
        <Grid
          container
          alignItems="flex-start"
          direction="row"
          justify="space-between"
        >
          <Grid item>
            <Typography variant="subtitle1" color="textPrimary" noWrap>
              Exchange Status:{" "}
              {state.account && state.contract && state.exchangeIsOpen
                ? "open"
                : "closed"}
            </Typography>
          </Grid>
          <Grid item>
            <Grid container alignItems="flex-end" direction="column">
              <Grid item component={Link} to="User">
                <Typography variant="subtitle1" color="textPrimary" noWrap>
                  EE$ Staked Amt:{" "}
                  {state.account &&
                    state.contract &&
                    state.web3.utils.fromWei(state.userStaked)}
                </Typography>
              </Grid>
              <Grid item component={Link} to="User">
                <Typography variant="subtitle1" color="textSecondary" noWrap>
                  EE$ Balance Amt:{" "}
                  {state.account &&
                    state.contract &&
                    state.web3.utils.fromWei(state.userBalance)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </React.Fragment>
  );
}
