import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
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
  const { state } = useContext(Store);
  const [increaseStakeTokens, setIncreaseStakeTokens] = useState(0.01);
  const [decreaseStakeTokens, setDecreaseStakeTokens] = useState(0.01);
  const [buyTokens, setBuyTokens] = useState(0.01);
  const [newCompany, setNewCompany] = useState({
    name: "",
    symbol: "",
    price: 0
  });
  const handleNewCompany = name => event => {
    setNewCompany({ ...newCompany, [name]: event.target.value });
  };
  const handleBuyTokens = () => async event => {
    setBuyTokens(event.target.value);
  };
  const createNewCompanyAndListTransaction = async () => {
    if (state.contract) {
      const c = state.contract;
      await c.methods
        .createCompanyAndList(
          newCompany.name,
          newCompany.symbol,
          state.web3.utils.toWei(Number(newCompany.price).toFixed(18))
        )
        .send();
    }
  };
  const buyExchangeTokenTransaction = async () => {
    if (state.contract) {
      const c = state.contract;
      await c.methods.buyExchangeToken().send({
        value: state.web3.utils.toWei(Number(buyTokens).toFixed(18))
      });
    }
  };
  const decreaseStakeExchangeTokenTransaction = async () => {
    if (state.exchangeToken) {
      const c = state.exchangeToken;
      await c.methods
        .decreaseAllowance(state.exchangeAddress, decreaseStakeTokens)
        .send({
          value: state.web3.utils.toWei(Number(state.transactBuyEE).toFixed(18))
        });
    }
  };
  const increaseStakeExchangeTokenTransaction = async () => {
    if (state.exchangeToken) {
      const c = state.exchangeToken;
      await c.methods
        .increaseAllowance(state.exchangeAddress, increaseStakeTokens)
        .send({
          value: state.web3.utils.toWei(Number(state.transactBuyEE).toFixed(18))
        });
    }
  };
  return (
    <React.Fragment>
      <Paper className={classes.container}>
        <Grid container direction="column">
          <Grid item>
            <Typography variant="h6" noWrap>
              Buy Exchange Tokens (EE$)
            </Typography>
            <Grid container direction="row" alignItems="center">
              <Grid item>
                <TextField
                  key="AmountofEE"
                  id="AmountofEE"
                  label="Amount Of EE$"
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
                  color="primary"
                  size="large"
                  variant="contained"
                  className={classes.button}
                  onClick={buyExchangeTokenTransaction}
                >
                  send
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Typography variant="h6">
            Create Company and List on Exchange
          </Typography>
          <Box display="flex" alignItems="center">
            <TextField
              id="CompanyName"
              label="Company Name"
              className={classes.textField}
              value={newCompany.name}
              onChange={handleNewCompany("name")}
              margin="normal"
              variant="outlined"
            />
            <TextField
              id="CompanySymbol"
              label="Company Symbol"
              className={classes.textField}
              value={newCompany.symbol}
              onChange={handleNewCompany("symbol")}
              margin="normal"
              variant="outlined"
            />
            <TextField
              id="PricePerShare"
              label="Price per 1 unit share (EE$)"
              value={newCompany.price}
              onChange={handleNewCompany("price")}
              type="number"
              inputProps={{ step: "0.01", min: "0.000000000000000001" }}
              className={classes.textField}
              InputLabelProps={{
                shrink: true
              }}
              margin="normal"
              variant="outlined"
            />
            <Button
              color="primary"
              size="large"
              variant="contained"
              className={classes.button}
              onClick={createNewCompanyAndListTransaction}
            >
              send
            </Button>
          </Box>
        </Grid>
      </Paper>
    </React.Fragment>
  );
}
