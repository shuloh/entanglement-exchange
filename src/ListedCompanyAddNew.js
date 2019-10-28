import React, { useContext, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
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
export default function ListedCompanyAddNew(props) {
  const { state } = useContext(Store);
  const classes = useStyles();
  const [newCompany, setNewCompany] = useState({
    name: "",
    symbol: "",
    price: 0
  });
  const handleNewCompany = name => event => {
    setNewCompany({ ...newCompany, [name]: event.target.value.toString() });
  };
  const createNewCompanyAndListTransaction = async () => {
    if (state.contract) {
      const c = state.contract;
      await c.methods
        .createCompanyAndList(
          newCompany.name,
          newCompany.symbol,
          state.web3.utils.toWei(newCompany.price)
        )
        .send();
    }
  };
  return (
    <React.Fragment>
      <Dialog
        maxWidth="xl"
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add new company</DialogTitle>

        <DialogContent>
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
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
