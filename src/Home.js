import React from "react";
import { CssBaseline } from "@material-ui/core";
import { Container } from "@material-ui/core";
import NavBar from "./NavBar";
import ListedCompaniesGrid from "./ListedCompaniesGrid";

export default function Home() {
  return (
    <div>
      <CssBaseline />
      <Container width="75%">
        <NavBar />
        <ListedCompaniesGrid />
      </Container>
    </div>
  );
}
