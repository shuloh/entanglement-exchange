import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import getWeb3 from "./utils/getWeb3";
import PrivSecMarket from "./contracts/PrivSecMarket.json";
import { Store } from "./Store";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    background: "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)"
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}));

export default function NavBar() {
  const classes = useStyles();
  const { state, dispatch } = useContext(Store);
  async function connectWeb3() {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
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
      const deployedNetwork = PrivSecMarket.networks[networkId];
      const instance = new web3.eth.Contract(
        PrivSecMarket.abi,
        deployedNetwork && deployedNetwork.address
      );
      dispatch({
        type: "SET_CONTRACT",
        payload: instance
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert("error:" + JSON.stringify(error));
    }
    console.log(state);
  }
  return (
    <AppBar position="static" className={classes.root}>
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          News
        </Typography>
        <Typography variant="subtitle2" className={classes.title}>
          {state.user}
        </Typography>
        <Button color="inherit" onClick={connectWeb3}>
          {state.user ? state.user : "Connect Web3"}
        </Button>
      </Toolbar>
    </AppBar>
  );
}
