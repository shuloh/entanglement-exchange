import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { Store } from "./Store";
import PrivateExchangeProxy from "./contracts/PrivateExchangeProxy.json";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
    width: "auto"
  }
}));

export default function About() {
  const classes = useStyles();
  const { state } = useContext(Store);
  const [contractAddress, setAddress] = useState("");
  const [contractOwner, setOwner] = useState("");
  const fetchContractDetails = async () => {
    if (state.contract) {
      const c = state.contract;
      setAddress(c.options.address);
      const cOwner = await c.methods.owner().call({ from: state.account });
      setOwner(cOwner);
    }
  };
  useEffect(() => {
    fetchContractDetails();
  });
  return (
    <React.Fragment>
      <Paper className={classes.root}>
        <Typography variant="h6" noWrap>
          Exchange Contract Address: {contractAddress}
        </Typography>
        <Typography variant="h6" noWrap>
          Exchange Owner: {contractOwner}
        </Typography>
      </Paper>
    </React.Fragment>
  );
}
