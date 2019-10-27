import React, { useContext } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import { Store } from "./Store";

export default function ListedCompanyDial(props) {
  const { state, dispatch } = useContext(Store);
  const [buyShares, setBuyShares] = React.useState(0);
  const [listShares, setListShares] = React.useState(0);
  const [mintShares, setMintShares] = React.useState(0);
  const handleBuyShares = () => async event => {
    setBuyShares(event.target.value);
  };
  const handleListShares = () => async event => {
    setListShares(event.target.value);
  };
  const handleMintShares = () => async event => {
    setMintShares(event.target.value);
  };
  const buySharesTransaction = async () => {
    if (state.contract) {
      const c = state.contract;
      console.log(props.address);
      console.log(buyShares);
      await c.methods
        .buyCompanyShares(
          props.address,
          state.web3.utils.toWei(Number(buyShares).toFixed(18))
        )
        .send();
    }
  };
  const mintSharesTransaction = async () => {
    if (props.company.contract) {
      const c = props.company.contract;
      const result = await c.methods
        .mint(state.web3.utils.toWei(Number(mintShares).toFixed(18)))
        .send();
      const newSupply = await c.methods.totalSupply().call();
      dispatch({
        type: "UPDATE_EXCHANGE_COMPANY",
        payload: {
          address: props.address,
          key: "totalSupply",
          value: newSupply
        }
      });

      console.log(result);
    }
  };
  const listSharesTransaction = async () => {
    if (props.company.contract) {
      const c = props.company.contract;
      const result = await c.methods
        .increaseAllowance(
          state.exchangeAddress,
          state.web3.utils.toWei(Number(listShares).toFixed(18))
        )
        .send();
      const newSharesListed = result.events.Approval.returnValues.value;
      dispatch({
        type: "UPDATE_EXCHANGE_COMPANY",
        payload: {
          address: props.address,
          key: "sharesForSale",
          value: newSharesListed
        }
      });

      console.log(result);
    }
  };
  return (
    <React.Fragment>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{props.company.symbol}</DialogTitle>

        <DialogContent>
          <Grid container direction="row" alignItems="center" spacing={2}>
            <Grid item zeroMinWidth>
              <TextField
                key="buyShares"
                id="buyShares"
                label="Buy No. of Shares"
                value={buyShares}
                onChange={handleBuyShares()}
                type="number"
                inputProps={{ step: "0.01", min: "0.000000000000000001" }}
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
                onClick={buySharesTransaction}
              >
                send
              </Button>
            </Grid>
          </Grid>
          {props.company.owner === state.account && (
            <React.Fragment>
              <Grid container direction="row" alignItems="center" spacing={2}>
                <Grid item zeroMinWidth>
                  <TextField
                    key="listShares"
                    id="listShares"
                    label="List No. of Shares"
                    value={listShares}
                    onChange={handleListShares()}
                    type="number"
                    inputProps={{ step: "0.01", min: "0.000000000000000001" }}
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
                    onClick={listSharesTransaction}
                  >
                    list
                  </Button>
                </Grid>
              </Grid>
              <Grid container direction="row" alignItems="center" spacing={2}>
                <Grid item zeroMinWidth>
                  <TextField
                    key="mintShares"
                    id="mintShares"
                    label="Mint No. of Shares"
                    value={mintShares}
                    onChange={handleMintShares()}
                    type="number"
                    inputProps={{ step: "0.01", min: "0.000000000000000001" }}
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
                    onClick={mintSharesTransaction}
                  >
                    list
                  </Button>
                </Grid>
              </Grid>
            </React.Fragment>
          )}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
