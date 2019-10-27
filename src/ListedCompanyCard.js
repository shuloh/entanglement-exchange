import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Fab from "@material-ui/core/Fab";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { Store } from "./Store";
import EditIcon from "@material-ui/icons/Edit";
const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 275,
    backgroundColor: theme.palette.secondary.dark
  },
  pos: {
    marginBottom: 12
  },
  fab: {
    float: "right",
    margin: theme.spacing(1)
  }
}));

export default function ListedCompanyCard(props) {
  const classes = useStyles();
  const { state } = useContext(Store);

  return (
    <Card className={classes.card} raised>
      <CardContent>
        <Typography variant="h5">
          {state.exchangeCompanies[props.address].symbol}
        </Typography>
        <Typography variant="h6" className={classes.pos} color="textSecondary">
          {state.exchangeCompanies[props.address].name}
        </Typography>
        <Typography variant="body2" noWrap>
          Address: {props.address}
          {<br />}
          Price/Share:{" "}
          {state.web3.utils.fromWei(
            state.exchangeCompanies[props.address].pricePerShare.toString()
          )}
          {<br />}
          Shares for Sale:{" "}
          {state.web3.utils.fromWei(
            state.exchangeCompanies[props.address].sharesForSale.toString()
          )}
          {<br />}
          Total Supply:{" "}
          {state.web3.utils.fromWei(
            state.exchangeCompanies[props.address].totalSupply.toString()
          )}
        </Typography>
        <Fab
          color="default"
          size="small"
          aria-label="edit"
          className={classes.fab}
          onClick={props.edit(props.address)}
        >
          <EditIcon />
        </Fab>
      </CardContent>
    </Card>
  );
}
