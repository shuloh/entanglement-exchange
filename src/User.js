import React, { useContext } from "react";
import UserCapabilities from "./UserCapabilities";
import UserAdmin from "./UserAdmin";
import { Store } from "./Store";
export default function User() {
  const { state } = useContext(Store);

  return (
    <React.Fragment>
      {state.contract && state.account && <UserCapabilities />}
      {state.contract && state.account && state.userIsAdmin && <UserAdmin />}
    </React.Fragment>
  );
}
