import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Fab from "@material-ui/core/Fab";
import ListedCompanyCard from "./ListedCompanyCard";
import ListedCompanyDial from "./ListedCompanyDial";
import AddIcon from "@material-ui/icons/Add";
import { Store } from "./Store";
import ListedCompanyAddNew from "./ListedCompanyAddNew";

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

  const [newCompanyOpen, setNewCompanyOpen] = React.useState(false);
  const handleClickOpen = address => event => {
    setOpen(true);
    setAddress(address);
    setCompany(state.exchangeCompanies[address]);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const newCompanyClose = () => {
    setNewCompanyOpen(false);
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
          <Grid item>
            <Fab
              color="primary"
              aria-label="add"
              className={classes.fab}
              onClick={() => {
                setNewCompanyOpen(true);
              }}
            >
              <AddIcon />
            </Fab>
          </Grid>
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
      <ListedCompanyAddNew
        open={newCompanyOpen}
        handleClose={newCompanyClose}
      />
      <ListedCompanyDial
        open={open}
        address={address}
        company={company}
        handleClose={handleClose}
      />
    </React.Fragment>
  );
}
