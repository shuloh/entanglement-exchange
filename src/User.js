import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Box from "@material-ui/core/Box";

import { Store } from "./Store";
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

export default function User() {
  const classes = useStyles();
  const { state } = useContext(Store);

  const AdminCapabilities = () => {
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
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="admin-capabilities"
            id="admin-capabilities"
          >
            <Typography variant="h6">
              You are the administrator of this exchange.
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Box>
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
            </Box>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </React.Fragment>
    );
  };
  const UserCapabilities = () => {
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
    const createNewCompanyAndListTransaction = () => {
      const f = async () => {
        if (state.contract) {
          const c = state.contract;
          await c.methods
            .createCompanyAndList(
              state.transactNewCompanyName,
              state.transactNewCompanySymbol,
              state.transactNewCompanyPrice
            )
            .send();
          dispatch({ type: "CLEAR_USER_NEWCOMPANY" });
        }
      };
      f();
    };
    const buyExchangeTokenTransaction = () => {
      const f = async () => {
        if (state.contract) {
          const c = state.contract;
          await c.methods.buyExchangeToken().send({
            value: state.web3.utils.toWei(state.transactBuyEE.toString())
          });
        }
      };
      f();
    };
    return (
      <React.Fragment>
        <Paper className={classes.container}>
          <Typography variant="h5" noWrap>
            Account Details:
          </Typography>
          <Typography variant="h6" noWrap>
            Balance:
            {state.userBalance
              ? state.web3.utils.fromWei(state.userBalance)
              : "-"}
            EE$
          </Typography>
        </Paper>
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
            <Grid item zeroMinWidth>
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
            <Grid item zeroMinWidth>
              <TextField
                id="PricePerShare"
                label="Price per Share (EE$)"
                value={state.transactNewCompanyPrice}
                onChange={handleNewCompany("price")}
                type="number"
                step="0.01"
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
                onClick={createNewCompanyAndListTransaction}
              >
                send
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Paper className={classes.container}>
          <Typography variant="h6" noWrap>
            Buy Exchange Tokens (EE$)
          </Typography>
          <Grid container direction="row" alignItems="center" spacing={2}>
            <Grid item zeroMinWidth>
              <TextField
                id="AmountofEE"
                label="AmountOfEE"
                value={state.transactBuyEE}
                onChange={handleBuyEE()}
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
      </React.Fragment>
    );
  };
  return (
    <React.Fragment>
      <Box className={classes.root}>
        {state.userIsAdmin && <AdminCapabilities />}
        {state.contract && <UserCapabilities />}
      </Box>
    </React.Fragment>
  );
}
