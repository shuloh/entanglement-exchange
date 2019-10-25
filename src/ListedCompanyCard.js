import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { Store } from "./Store";
const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 275,
    background: theme.palette.secondary.dark
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
}));

export default function ListedCompanyCard(props) {
  const classes = useStyles();
  const { state } = useContext(Store);

  return (
    <Card className={classes.card}>
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
            state.exchangeCompanies[props.address].pricePerShare
          )}
          {<br />}
          Shares for Sale:{" "}
          {state.exchangeCompanies[props.address].sharesForSale}
        </Typography>
      </CardContent>
      <CardActions>
        {/* <Button size="small">Learn More</Button> */}
      </CardActions>
    </Card>
  );
}
