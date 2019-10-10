import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
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
  connector: {
    display: "flex",
    flexWrap: "wrap"
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
  const connectWeb3 = async () => {
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
  };
  return (
    <React.Fragment>
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
            Private Securities Marketplace
          </Typography>
          <FormGroup className={classes.connector}>
            <FormControlLabel
              className={classes.connector}
              labelPlacement="start"
              control={
                <Switch
                  className={classes.connector}
                  checked={state.account !== null}
                  disabled={state.account !== null}
                  onChange={connectWeb3}
                  aria-label="connect switch"
                />
              }
              label={
                <Typography
                  variant="caption"
                  className={classes.title}
                  gutterBottom
                >
                  {state.account ? state.account : "Connect Web3"}
                </Typography>
              }
            />
          </FormGroup>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}
