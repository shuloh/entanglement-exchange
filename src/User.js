import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";

import { Store } from "./Store";
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1, 0, 0, 0)
  },
  container: {
    padding: theme.spacing(2, 3, 2, 3)
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
  dense: {
    marginTop: 19
  },
  menu: {
    width: 200
  },
  button: {
    margin: theme.spacing(1)
  }
}));

const UserCapabilities = () => {
  const classes = useStyles();
  const { state, dispatch } = useContext(Store);
  const handleNewCompany = name => event => {
    dispatch({
      type: "SET_USER_NEWCOMPANY",
      subtype: name,
      payload: event.target.value
    });
  };
  const handleBuyEE = name => event => {
    dispatch({ type: "SET_USER_BUYEE", payload: event.target.value });
  };
  const createNewCompanyAndListTransaction = async () => {
    if (state.contract) {
      const c = state.contract;
      await c.methods
        .createCompanyAndList(
          state.transactNewCompanyName,
          state.transactNewCompanySymbol,
          state.web3.utils.toWei(state.transactNewCompanyPrice.toString())
        )
        .send();
      dispatch({ type: "CLEAR_USER_NEWCOMPANY" });
    }
  };
  const buyExchangeTokenTransaction = async () => {
    if (state.contract) {
      const c = state.contract;
      await c.methods.buyExchangeToken().send({
        value: state.web3.utils.toWei(state.transactBuyEE.toString())
      });
    }
  };
  return (
    <React.Fragment>
      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="stretch"
        spacing={1}
      >
        <Grid item>
          <Paper className={classes.container}>
            <Typography variant="h6" noWrap>
              Balance:{" "}
              {state.userBalance
                ? state.web3.utils.fromWei(state.userBalance)
                : "-"}
              EE$
            </Typography>
          </Paper>
        </Grid>
        <Grid item zeroMinWidth>
          <Paper className={classes.container}>
            <Typography variant="h6" noWrap>
              Create Company and List on Exchange
            </Typography>
            <Grid container direction="row" alignItems="center" spacing={2}>
              <Grid item zeroMinWidth>
                <TextField
                  id="CompanyName"
                  label="Company Name"
                  className={classes.textField}
                  value={state.transactNewCompanyName}
                  onChange={handleNewCompany("name")}
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid item>
                <TextField
                  id="CompanySymbol"
                  label="Company Symbol"
                  className={classes.textField}
                  value={state.transactNewCompanySymbol}
                  onChange={handleNewCompany("symbol")}
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid item>
                <TextField
                  id="PricePerShare"
                  label="Price per 1 unit share (EE$)"
                  value={state.transactNewCompanyPrice}
                  onChange={handleNewCompany("price")}
                  type="number"
                  inputProps={{ step: "0.01", min: "0.01" }}
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
                  onClick={createNewCompanyAndListTransaction}
                >
                  send
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item>
          <Paper className={classes.container}>
            <Typography variant="h6" noWrap>
              Buy Exchange Tokens (EE$)
            </Typography>
            <Grid container direction="row" alignItems="center" spacing={2}>
              <Grid item zeroMinWidth>
                <TextField
                  key="AmountofEE"
                  id="AmountofEE"
                  label="AmountOfEE"
                  value={state.transactBuyEE}
                  onChange={handleBuyEE()}
                  type="number"
                  inputProps={{ step: "0.01", min: "0.00000000000000000 1" }}
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true
                  }}
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid item zeroMinWidth>
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
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
const AdminCapabilities = () => {
  const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
      padding: theme.spacing(1, 0, 0, 0)
    },
    container: {
      padding: theme.spacing(2, 3, 2, 3)
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200
    },
    dense: {
      marginTop: 19
    },
    menu: {
      width: 200
    },
    button: {
      margin: theme.spacing(1)
    }
  }));
  const classes = useStyles();
  const { state, dispatch } = useContext(Store);
  const switchOpenMode = event => {
    dispatch({ type: "SET_ADMIN_OPENMODE", payload: event.target.value });
  };
  const switchOpenModeTransaction = async () => {
    const c = state.contract;
    await c.methods.switchOpenMode(state.transactAdminOpenMode).send();
  };
  return (
    <React.Fragment>
      <Paper className={classes.container}>
        <Typography variant="h5" noWrap>
          Administrator:
        </Typography>
        <Typography variant="h6" noWrap>
          Open Exchange?
        </Typography>
        <Grid container direction="row" alignItems="center" spacing={2}>
          <Grid item zeroMinWidth>
            <TextField
              id="ExchangeOpenMode"
              select
              label="Select"
              className={classes.textField}
              value={state.transactAdminOpenMode}
              SelectProps={{
                MenuProps: {
                  className: classes.menu
                }
              }}
              margin="normal"
              variant="outlined"
              onChange={switchOpenMode}
            >
              {[
                { key: "false", value: false },
                { key: "true", value: true }
              ].map(kvp => (
                <MenuItem key={kvp.key} value={kvp.value}>
                  {kvp.key}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item zeroMinWidth>
            <Button
              size="medium"
              color="primary"
              variant="contained"
              className={classes.button}
              onClick={switchOpenModeTransaction}
            >
              send
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </React.Fragment>
  );
};
export default function User() {
  const classes = useStyles();
  const { state } = useContext(Store);

  return (
    <React.Fragment>
      {console.log("test")}
      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="stretch"
        className={classes.root}
        spacing={1}
      >
        <Grid item>{state.contract && <UserCapabilities />}</Grid>
        <Grid item>
          {state.contract && state.userIsAdmin && <AdminCapabilities />}
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
