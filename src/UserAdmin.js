import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";

import { Store } from "./Store";
const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(2, 3, 2, 3)
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
  menu: {
    width: 1000
  },
  button: {
    margin: theme.spacing(1)
  }
}));

export default function UserAdmin() {
  const [adminMode, setAdminMode] = useState(false);
  const { state, dispatch } = useContext(Store);
  const classes = useStyles();
  const switchOpenModeTransaction = async () => {
    try {
      dispatch({
        type: "LOADING"
      });
      if (state.contract) {
        const c = state.contract;
        await c.methods.switchOpenMode(adminMode).send();
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
        <Typography variant="h5" noWrap>
          Administrator:
        </Typography>
        <Typography variant="h6" noWrap>
          Open Exchange?
        </Typography>
        <Grid container direction="row" alignItems="center" spacing={2}>
          <Grid item>
            <TextField
              id="ExchangeOpenMode"
              select
              label="Select"
              className={classes.textField}
              value={adminMode}
              SelectProps={{
                MenuProps: {
                  className: classes.menu
                }
              }}
              margin="normal"
              variant="outlined"
              onChange={event => {
                setAdminMode(event.target.value);
              }}
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
          <Grid item>
            <Button
              disabled={state.loading}
              size="large"
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
}
