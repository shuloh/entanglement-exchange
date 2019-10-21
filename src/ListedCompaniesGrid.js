import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import ListedCompanyCard from "./ListedCompanyCard";
import { Store } from "./Store";
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  }
}));

export default function ListedCompaniesGrid() {
  const classes = useStyles();
  const { state } = useContext(Store);

  return (
    <Grid
      container
      className={classes.root}
      direction="row"
      justify="space-evenly"
      alignItems="flex-start"
      spacing={2}
    >
      {state.listedCompanies.map((value, index) => (
        <Grid key={value} item>
          <ListedCompanyCard className={classes.paper} companyDescr={value} />
        </Grid>
      ))}
    </Grid>
  );
}
