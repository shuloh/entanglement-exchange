import React from "react";
import { CssBaseline } from "@material-ui/core";
import { Container } from "@material-ui/core";
import NavBar from "./NavBar";

export default function Home() {
  return (
    <div>
      <CssBaseline />
      <Container width="75%">
        <NavBar />
      </Container>
    </div>
  );
}
