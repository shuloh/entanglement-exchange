import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import ListedCompanyCard from "./ListedCompanyCard";

import { Store } from "./Store";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    height: 140,
    width: 100
  }
}));

export default function ListedCompaniesGrid() {
  const classes = useStyles();
  const { state } = useContext(Store);

  return (
    <React.Fragment>
      <Grid
        container
        className={classes.root}
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        spacing={2}
      >
        {Object.keys(state.exchangeCompanies).map((value, index) => (
          <Grid key={index} item>
            <ListedCompanyCard className={classes.paper} address={value} />
          </Grid>
        ))}
      </Grid>
    </React.Fragment>
  );
}
