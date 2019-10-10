import getWeb3 from "./utils/getWeb3";
import PrivSecMarket from "./contracts/PrivSecMarket.json";
import React, { useContext, useState, useEffect } from "react";
import { CssBaseline } from "@material-ui/core";
import { Container } from "@material-ui/core";
import NavBar from "./NavBar";
import { Store } from "./Store";

export default function Home() {
  const { state, dispatch } = useContext(Store);
  useEffect(() => {
    async function setContract() {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = PrivSecMarket.networks[networkId];
        const instance = new web3.eth.Contract(
          PrivSecMarket.abi,
          deployedNetwork && deployedNetwork.address
        );
        console.log(instance);
        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        // this.setState({ web3, accounts, contract: instance }, this.runExample);
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert("error:" + JSON.stringify(error));
      }
    }
    setContract();
  });
  return (
    <div>
      <CssBaseline />
      <Container maxWidth="sm">
        <NavBar />
      </Container>
    </div>
  );
}
