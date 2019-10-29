import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import { Store } from "./Store";
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1, 0, 0, 0)
  },
  container: {
    padding: theme.spacing(2, 3, 2, 3),
    alignItems: "center"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
  menu: {
    width: 200
  },
  button: {
    margin: theme.spacing(1)
  }
}));

export default function UserCapabilities() {
  const classes = useStyles();
  const { state, dispatch } = useContext(Store);
  const [increaseStakeTokens, setIncreaseStakeTokens] = useState("0");
  const [decreaseStakeTokens, setDecreaseStakeTokens] = useState("0");
  const [buyTokens, setBuyTokens] = useState("0");
  const [sellTokens, setSellTokens] = useState("0");

  const handleBuyTokens = () => async event => {
    setBuyTokens(event.target.value.toString());
  };

  const handleSellTokens = () => async event => {
    setSellTokens(event.target.value.toString());
  };

  const handleIncreaseStakeTokens = () => async event => {
    setIncreaseStakeTokens(event.target.value.toString());
  };

  const handleDecreaseStakeTokens = () => async event => {
    setDecreaseStakeTokens(event.target.value.toString());
  };

  const buyExchangeTokenTransaction = async () => {
    try {
      dispatch({ type: "LOADING" });
      if (state.contract) {
        const c = state.contract;
        await c.methods.buyExchangeToken().send({
          value: state.web3.utils.toWei(buyTokens)
        });
        setBuyTokens(0);
        const _ethBalance = await state.web3.eth.getBalance(state.account);
        dispatch({
          type: "SET_USER_ETHBALANCE",
          payload: _ethBalance.toString()
        });
      }
    } finally {
      dispatch({ type: "LOADED" });
    }
  };

  const sellExchangeTokenTransaction = async () => {
    try {
      dispatch({
        type: "LOADING"
      });
      if (state.contract) {
        const c = state.contract;
        const amount = state.web3.utils.toWei(sellTokens);
        await c.methods.sellExchangeToken(amount).send();
        setSellTokens(0);
        const _ethBalance = await state.web3.eth.getBalance(state.account);
        dispatch({
          type: "SET_USER_ETHBALANCE",
          payload: _ethBalance.toString()
        });
      }
    } finally {
      dispatch({
        type: "LOADED"
      });
    }
  };

  const decreaseStakeExchangeTokenTransaction = async () => {
    try {
      dispatch({
        type: "LOADING"
      });
      if (state.exchangeToken) {
        const c = state.exchangeToken;
        const result = await c.methods
          .decreaseAllowance(
            state.exchangeAddress,
            state.web3.utils.toWei(decreaseStakeTokens)
          )
          .send();
        const newStake = result.events.Approval.returnValues.value;
        setDecreaseStakeTokens(0);
        dispatch({ type: "SET_USER_STAKED", payload: newStake });
        const _ethBalance = await state.web3.eth.getBalance(state.account);
        dispatch({
          type: "SET_USER_ETHBALANCE",
          payload: _ethBalance.toString()
        });
      }
    } finally {
      dispatch({
        type: "LOADED"
      });
    }
  };
  const increaseStakeExchangeTokenTransaction = async () => {
    try {
      dispatch({
        type: "LOADING"
      });
      if (state.exchangeToken) {
        const c = state.exchangeToken;
        const result = await c.methods
          .increaseAllowance(
            state.exchangeAddress,
            state.web3.utils.toWei(increaseStakeTokens)
          )
          .send();
        const newStake = result.events.Approval.returnValues.value;
        setIncreaseStakeTokens(0);
        dispatch({ type: "SET_USER_STAKED", payload: newStake });
        const _ethBalance = await state.web3.eth.getBalance(state.account);
        dispatch({
          type: "SET_USER_ETHBALANCE",
          payload: _ethBalance.toString()
        });
      }
    } finally {
      dispatch({
        type: "LOADED"
      });
    }
  };
  return (
    <React.Fragment>
      <Paper className={classes.container}>
        <Grid container direction="column">
          <Grid item>
            <Grid container direction="row" alignItems="center">
              <Grid item>
                <TextField
                  key="IncreaseStake"
                  id="DecreaseStake"
                  label="Increase Allowance (EE$)"
                  value={increaseStakeTokens}
                  onChange={handleIncreaseStakeTokens()}
                  type="number"
                  inputProps={{ step: "0.01", min: "0.000000000000000001" }}
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true
                  }}
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid item>
                <Button
                  disabled={state.loading}
                  color="primary"
                  size="large"
                  variant="contained"
                  className={classes.button}
                  onClick={increaseStakeExchangeTokenTransaction}
                >
                  increase
                </Button>
              </Grid>
              <Grid item>
                <TextField
                  key="DecreaseStake"
                  id="DecreaseStake"
                  label="Decrease Allowance (EE$)"
                  value={decreaseStakeTokens}
                  onChange={handleDecreaseStakeTokens()}
                  type="number"
                  inputProps={{ step: "0.01", min: "0.000000000000000001" }}
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true
                  }}
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid item>
                <Button
                  disabled={state.loading}
                  color="primary"
                  size="large"
                  variant="contained"
                  className={classes.button}
                  onClick={decreaseStakeExchangeTokenTransaction}
                >
                  decrease
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="row" alignItems="center">
              <Grid item>
                <TextField
                  key="buyToke"
                  id="buyToken"
                  label="Amount Of EE$ to buy"
                  value={buyTokens}
                  onChange={handleBuyTokens()}
                  type="number"
                  inputProps={{ step: "0.01", min: "0.000000000000000001" }}
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true
                  }}
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid item>
                <Button
                  disabled={state.loading}
                  color="primary"
                  size="large"
                  variant="contained"
                  className={classes.button}
                  onClick={buyExchangeTokenTransaction}
                >
                  buy
                </Button>
              </Grid>
              <Grid item>
                <TextField
                  key="sellToken"
                  id="sellToken"
                  label="Amount Of EE$ to sell"
                  value={sellTokens}
                  onChange={handleSellTokens()}
                  type="number"
                  inputProps={{ step: "0.01", min: "0.000000000000000001" }}
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true
                  }}
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid item>
                <Button
                  disabled={state.loading}
                  color="primary"
                  size="large"
                  variant="contained"
                  className={classes.button}
                  onClick={sellExchangeTokenTransaction}
                >
                  sell (from allowance)
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </React.Fragment>
  );
}
