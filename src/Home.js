import React, { useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import IPrivateCompany from "./contracts/IPrivateCompany.json";

import { Store } from "./Store";
import ListedCompaniesGrid from "./ListedCompaniesGrid";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2)
  }
}));
export default function Home() {
  const classes = useStyles();
  const { state, dispatch } = useContext(Store);

  useEffect(() => {
    async function fetchCompanies() {
      if (state.contract) {
        const nCompanies = await state.contract.methods
          .numberOfListedCompanies()
          .call({ from: state.account });
        for (var i = 0; i < nCompanies; i++) {
          const cAddress = await state.contract.methods.listedCompanies.call(
            i,
            { from: state.account }
          );
          if (state.listedCompanies[cAddress]) {
            continue;
          } else {
            const companyContract = await new state.web3.Contract(
              IPrivateCompany.abi,
              cAddress
            );
            const companyName = await companyContract.methods
              .name()
              .call({ from: state.account });
            const companySymbol = await companyContract.methods
              .symbol()
              .call({ from: state.account });
            dispatch({
              type: "ADD_LISTEDCOMPANY",
              payload: {
                key: cAddress,
                value: {
                  name: companyName,
                  symbol: companySymbol,
                  contract: companyContract
                }
              }
            });
          }
        }
      }
    }
    fetchCompanies();
  });
  return (
    <React.Fragment>
      <Paper className={classes.root}>
        <Typography variant="h6">Listed Companies</Typography>
        <ListedCompaniesGrid />
      </Paper>
    </React.Fragment>
  );
}
