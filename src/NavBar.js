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

import { Store } from "./Store";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    background: "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)"
  },
  title: {
    flexGrow: 1
  }
}));

export default function NavBar() {
  const classes = useStyles();
  const { state, dispatch } = useContext(Store);
  const connectWeb3 = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      web3.eth.defaultAccount = accounts[0];
      dispatch({
        type: "SET_ACCOUNT",
        payload: accounts[0]
      });

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      dispatch({
        type: "SET_NETWORK",
        payload: networkId
      });
      const deployedProxy = PrivateExchangeProxy.networks[networkId];
      const instance = new web3.eth.Contract(
        PrivateExchangeLogic.abi,
        deployedProxy.address
      );
      dispatch({
        type: "SET_CONTRACT",
        payload: instance
      });

      const nListedCompanies = await instance.methods
        .numberOfListedCompanies()
        .call();
      dispatch({
        type: "SET_NLISTEDCOMPANIES",
        payload: nListedCompanies
      });

      var listedCompanies = [];
      for (var i = 0; i < nListedCompanies; i++) {
        const privateCompany = await instance.methods.listedCompanies.call(i);
        listedCompanies.push(privateCompany);
      }
      dispatch({
        type: "SET_LISTEDCOMPANIES",
        payload: listedCompanies
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert("error:" + JSON.stringify(error));
    }
  };
  return (
    <React.Fragment>
      <AppBar position="static" className={classes.root}>
        <Toolbar>
          <TemporaryDrawer />
          <Typography variant="h6" className={classes.title}>
            Entanglement Exchange
          </Typography>
          <Switch
            checked={state.account !== null}
            disabled={state.account !== null}
            onChange={connectWeb3}
            aria-label="Connect"
          />{" "}
          <Typography variant="body2">
            {state.account ? state.account : "Connect Web3"}
          </Typography>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}
