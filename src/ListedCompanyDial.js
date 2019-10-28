import React, { useContext } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import { useSnackbar } from "notistack";
import { Store } from "./Store";

export default function ListedCompanyDial(props) {
  const { state, dispatch } = useContext(Store);
  const [buySharesCost, setBuySharesCost] = React.useState("0");
  const [buyShares, setBuyShares] = React.useState(0);
  const [listShares, setListShares] = React.useState(0);
  const [delistShares, setDelistShares] = React.useState(0);
  const [mintShares, setMintShares] = React.useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const handleBuyShares = () => async event => {
    setBuyShares(event.target.value.toString());
    setBuySharesCost(
      (
        event.target.value *
        state.web3.utils.fromWei(props.company.pricePerShare)
      ).toString()
    );
  };
  const handleListShares = () => async event => {
    setListShares(event.target.value.toString());
  };
  const handleDelistShares = () => async event => {
    setDelistShares(event.target.value.toString());
  };
  const handleMintShares = () => async event => {
    setMintShares(event.target.value.toString());
  };
  const buySharesTransaction = async () => {
    if (state.contract) {
      const c = state.contract;
      await c.methods
        .buyCompanyShares(props.address, state.web3.utils.toWei(buyShares))
        .send();
      const remainingShares = await props.company.contract.methods
        .allowance(props.company.owner, state.exchangeAddress)
        .call();
      dispatch({
        type: "UPDATE_EXCHANGE_COMPANY",
        payload: {
          address: props.address,
          key: "sharesForSale",
          value: remainingShares
        }
      });
      const newTokenBalance = await c.methods.exchangeTokenBalance().call();
      dispatch({
        type: "SET_USER_BALANCE",
        payload: newTokenBalance
      });
      const newTokenStaked = await c.methods.exchangeTokenStaked().call();
      dispatch({
        type: "SET_USER_STAKED",
        payload: newTokenStaked
      });
      setBuyShares("0");
      setBuySharesCost("0");
      enqueueSnackbar("Buy shares transaction successful", {
        variant: "success"
      });
    }
  };
  const mintSharesTransaction = async () => {
    if (props.company.contract) {
      const c = props.company.contract;
      await c.methods.mint(state.web3.utils.toWei(mintShares)).send();
      const newSupply = await c.methods.totalSupply().call();
      dispatch({
        type: "UPDATE_EXCHANGE_COMPANY",
        payload: {
          address: props.address,
          key: "totalSupply",
          value: newSupply
        }
      });
      const ownedShares = await c.methods.balanceOf(state.account).call();
      dispatch({
        type: "UPDATE_EXCHANGE_COMPANY",
        payload: {
          address: props.address,
          key: "ownedShares",
          value: ownedShares
        }
      });
      setMintShares("0");
      enqueueSnackbar("Mint shares transaction successful", {
        variant: "success"
      });
    }
  };
  const listSharesTransaction = async () => {
    if (props.company.contract) {
      const c = props.company.contract;
      const result = await c.methods
        .increaseAllowance(
          state.exchangeAddress,
          state.web3.utils.toWei(listShares)
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
      setListShares("0");
      enqueueSnackbar("List shares transaction successful", {
        variant: "success"
      });
    }
  };
  const delistSharesTransaction = async () => {
    if (props.company.contract) {
      const c = props.company.contract;
      const result = await c.methods
        .decreaseAllowance(
          state.exchangeAddress,
          state.web3.utils.toWei(delistShares)
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
      setDelistShares("0");
      enqueueSnackbar("Delist shares transaction successful", {
        variant: "success"
      });
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
                helperText={"Cost in EE$: " + buySharesCost}
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
              <Typography variant="subtitle1" color="textSecondary">
                Owner Functions:
              </Typography>
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
                <Grid item zeroMinWidth>
                  <TextField
                    key="delistShares"
                    id="delistShares"
                    label="Delist No. of Shares"
                    value={delistShares}
                    onChange={handleDelistShares()}
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
                    onClick={delistSharesTransaction}
                  >
                    delist
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
                    mint
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
