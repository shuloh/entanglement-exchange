import React, { useState, useContext, useEffect } from "react";
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
import getWeb3 from "./utils/getWeb3";

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
  const { state, dispatch } = useContext(Store);
  const [user, setUser] = useState({
    isAdmin: false,
    balance: 0,
    ownedCompanies: 0
  });
  const [exchange, setExchange] = useState({ isOpen: false });
  useEffect(() => {
    const fetchUserDetails = async () => {
      const web3 = await getWeb3();
      const c = state.contract;
      const _isAdmin = await c.methods.isOwner().call({ from: state.account });
      const _balance = web3.utils.fromWei(
        await c.methods.exchangeTokenBalance().call({ from: state.account })
      );
      const _ownedCompanies = await c.methods
        .numberOfOwnedCompanies()
        .call({ from: state.account });
      setUser({
        ...user,
        isAdmin: _isAdmin,
        balance: _balance,
        ownedCompanies: _ownedCompanies
      });
    };
    const fetchIsExchangeOpen = async () => {
      const c = state.contract;
      const _isOpen = await c.methods.isOpen().call({ from: state.account });
      setExchange({ ...exchange, isOpen: _isOpen });
    };
    if (state.contract && state.account) {
      fetchUserDetails();
      fetchIsExchangeOpen();
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.contract, state.account]);

  const AdminCapabilities = () => {
    const [openMode, setOpenMode] = useState(false);
    const switchOpenMode = event => {
      setOpenMode(event.target.value);
    };
    const switchOpenModeTransaction = () => {
      const f = async () => {
        if (state.contract) {
          const c = state.contract;
          await c.methods.switchOpenMode(openMode).send({
            from: state.account
          });
        }
      };
      f();
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
                    value={openMode}
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
    const [newCompany, setNewCompany] = useState({
      name: "",
      symbol: "",
      price: 1
    });
    const [buyEE, setBuyEE] = useState(0);
    const handleNewCompany = name => event => {
      setNewCompany({ ...newCompany, [name]: event.target.value });
    };
    const handleBuyEE = name => event => {
      setBuyEE(event.target.value);
    };
    const createNewCompanyAndListTransaction = () => {
      const f = async () => {
        if (state.contract) {
          const c = state.contract;
          await c.methods
            .createCompanyAndList(
              newCompany.name,
              newCompany.symbol,
              newCompany.price
            )
            .send({
              from: state.account
            });
        }
      };
      f();
    };
    const buyExchangeTokenTransaction = () => {
      const f = async () => {
        if (state.contract) {
          const c = state.contract;
          const web3 = await getWeb3();
          await c.methods.buyExchangeToken().send({
            from: state.account,
            value: web3.utils.toWei(buyEE)
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
            Balance: {user.balance} EE$
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
                value={newCompany.name}
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
                value={newCompany.symbol}
                onChange={handleNewCompany("symbol")}
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item zeroMinWidth>
              <TextField
                id="PricePerShare"
                label="Price per Share (EE$)"
                value={newCompany.price}
                onChange={handleNewCompany("price")}
                type="number"
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
                value={buyEE}
                onChange={handleBuyEE()}
                type="number"
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
        {state.contract && user.isAdmin && <AdminCapabilities />}
        {state.contract && <UserCapabilities />}{" "}
      </Box>
    </React.Fragment>
  );
}
