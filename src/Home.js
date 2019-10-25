import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import ListedCompanyCard from "./ListedCompanyCard";
import { Store } from "./Store";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2)
  },
  card: {
    height: 140,
    width: 100
  }
}));

export default function Home() {
  const classes = useStyles();
  const { state } = useContext(Store);
  return (
    <React.Fragment>
      <Paper className={classes.root}>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
          spacing={2}
        >
          {Object.keys(state.exchangeCompanies).map(address => (
            <Grid item key={address}>
              <ListedCompanyCard
                key={address}
                className={classes.card}
                address={address}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>
    </React.Fragment>
  );
}
