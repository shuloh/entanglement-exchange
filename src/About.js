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
  const [exchange, setInfo] = useState({
    address: null,
    owner: null,
    status: false
  });
  useEffect(() => {
    console.log("EFFECT");
    const fetchContractDetails = async () => {
      if (state.contract) {
        const ex = state.contract;
        const exOwner = await ex.methods.owner().call({ from: state.account });
        const exStatus = await ex.methods
          .isOpen()
          .call({ from: state.account });
        setInfo({
          ...exchange,
          address: ex.options.address,
          owner: exOwner,
          status: exStatus
        });
      }
    };
    fetchContractDetails();
  }, [state.contract, state.account]);
  return (
    <React.Fragment>
      <Paper className={classes.root}>
        <Typography variant="h6" noWrap>
          Exchange Contract Address: {exchange.address}
        </Typography>
        <Typography variant="h6" noWrap>
          Exchange Owner: {exchange.owner}
        </Typography>
        <Typography variant="h6" noWrap>
          Exchange Status: {exchange.status ? "Open" : "Closed"}
        </Typography>
      </Paper>
    </React.Fragment>
  );
}
