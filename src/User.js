import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import { Store } from "./Store";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2)
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
    const [newCompany, setNewCompany] = useState({
      name: state.account.substring(35) + "Company",
      symbol: state.account.substring(35) + "COY",
      shares: 1000
    });
    const handleChange = name => event => {
      setNewCompany({ ...newCompany, [name]: event.target.value });
    };
    return (
      <React.Fragment>
        <Typography variant="h6">
          You are the administrator of this exchange.
        </Typography>
        <Divider />
        <br />
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
          />
          <TextField
            id="CompanySymbol"
            label="Company Symbol"
            className={classes.textField}
            value={newCompany.symbol}
            onChange={handleChange("symbol")}
            margin="normal"
          />
        </form>
      </React.Fragment>
    );
  };
  return (
    <React.Fragment>
      <Paper className={classes.root}>
        <Typography variant="h6">User Address: {state.account}</Typography>
        <Divider />
        <br />
        {user.isAdmin && <AdminCapabilities />}
      </Paper>
    </React.Fragment>
  );
}
