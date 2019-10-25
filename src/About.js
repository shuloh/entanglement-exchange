import React, { useContext } from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Store } from "./Store";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
    width: "auto"
  }
}));

export default function About() {
  const classes = useStyles();
  const { state } = useContext(Store);
  return (
    <React.Fragment>
      <Paper className={classes.root}>
        <Typography variant="body2" noWrap>
          Exchange Contract Address: {state.exchangeAddress}
        </Typography>
        <Typography variant="body2" noWrap>
          Exchange Status: {state.exchangeIsOpen ? "Open" : "Closed"}
        </Typography>
        <Typography variant="body2" noWrap>
          Exchange Owner: {state.exchangeOwner}
        </Typography>
        <Typography variant="body2" noWrap>
          Exchange Token:{" "}
          {state.exchangeToken ? state.exchangeToken.options.address : ""}
        </Typography>
        <Typography variant="body2" noWrap>
          Exchange Listed Companies Number: {state.exchangeNumberCompanies}
        </Typography>
      </Paper>
    </React.Fragment>
  );
}
