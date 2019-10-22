import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";

import { Store } from "./Store";
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2, 2, 2, 2)
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
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
  const [user, setUser] = useState({ isAdmin: null });
  useEffect(() => {
    if (user.isAdmin === null) {
      async function fetchIsLogicAdmin() {
        if (state.contract) {
          const c = state.contract;
          const _isAdmin = await c.methods
            .isOwner()
            .call({ from: state.account });
          setUser({ ...user, isAdmin: _isAdmin });
        }
      }
      fetchIsLogicAdmin();
    }
  });
  const AdminCapabilities = () => {
    const [openMode, setOpenMode] = useState(false);
    const [newCompany, setNewCompany] = useState({
      name: state.account.substring(35) + "Company",
      symbol: state.account.substring(35) + "COY",
      price: 1
    });
    const switchOpenMode = event => {
      setOpenMode(event.target.value);
    };
    const handleChange = name => event => {
      setNewCompany({ ...newCompany, [name]: event.target.value });
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
    return (
      <React.Fragment>
        <Typography variant="h6">
          You are the administrator of this exchange.
        </Typography>
        <Divider />
        <br />
        <Typography variant="h6">Open Exchange?</Typography>
        <form className={classes.container} noValidate autoComplete="off">
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
            {[{ key: "false", value: false }, { key: "true", value: true }].map(
              kvp => (
                <MenuItem key={kvp.key} value={kvp.value}>
                  {kvp.key}
                </MenuItem>
              )
            )}
          </TextField>
        </form>
        <Button
          size="medium"
          color="primary"
          variant="contained"
          className={classes.button}
          onClick={switchOpenModeTransaction}
        >
          send
        </Button>
        <Divider />
        <Typography variant="h6">
          Create and List New Company On Exchange
        </Typography>
        <form className={classes.container} noValidate autoComplete="off">
          <TextField
            id="CompanyName"
            label="Company Name"
            className={classes.textField}
            value={newCompany.name}
            onChange={handleChange("name")}
            margin="normal"
            variant="outlined"
          />
          <TextField
            id="CompanySymbol"
            label="Company Symbol"
            className={classes.textField}
            value={newCompany.symbol}
            onChange={handleChange("symbol")}
            margin="normal"
            variant="outlined"
          />
          <TextField
            id="Price per Share (EE$)"
            label="Price"
            value={newCompany.price}
            onChange={handleChange("price")}
            type="number"
            className={classes.textField}
            InputLabelProps={{
              shrink: true
            }}
            margin="normal"
            variant="outlined"
          />
        </form>
        <Button
          color="primary"
          size="medium"
          variant="contained"
          className={classes.button}
          onClick={createNewCompanyAndListTransaction}
        >
          send
        </Button>
        <Divider />
      </React.Fragment>
    );
  };
  return (
    <React.Fragment>
      <Paper className={classes.root}>
        <Typography variant="h6" noWrap>
          User Address: {state.account}
        </Typography>
        <Divider />
        <br />
        {user.isAdmin && <AdminCapabilities />}
      </Paper>
    </React.Fragment>
  );
}
