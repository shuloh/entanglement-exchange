import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import ListedCompanyCard from "./ListedCompanyCard";
import ListedCompanyDial from "./ListedCompanyDial";
import { Store } from "./Store";

const useStyles = makeStyles(theme => ({
  root: {
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
  const [open, setOpen] = React.useState(false);
  const [company, setCompany] = React.useState({});
  const [address, setAddress] = React.useState("");

  const handleClickOpen = address => event => {
    setOpen(true);
    setAddress(address);
    setCompany(state.exchangeCompanies[address]);
  };

  const handleClose = () => {
    setOpen(false);
  };
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
                edit={handleClickOpen}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>
      <ListedCompanyDial
        open={open}
        address={address}
        company={company}
        handleClose={handleClose}
        aria-labelledby="form-dialog-title"
      />
    </React.Fragment>
  );
}
