import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AppsIcon from "@material-ui/icons/Apps";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

import { Store } from "./Store";

const useStyles = makeStyles(theme => ({
  list: {
    width: 250
  },
  fullList: {
    width: "auto"
  },
  menuButton: {
    marginRight: theme.spacing(2)
  }
}));

export default function TemporaryDrawer() {
  const classes = useStyles();
  const { state, dispatch } = useContext(Store);

  const toggleDrawer = (side, open) => event => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    dispatch({
      type: "SIDE_DRAWER",
      payload: open
    });
  };
  const switchOpenMode = async () => {
    if (state.contract !== null) {
      await state.contract.methods.switchOpenMode(true).send();
    }
  };

  const sideList = side => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(side, false)}
      onKeyDown={toggleDrawer(side, false)}
    >
      <List>
        <ListItem button key={"Home"}>
          <ListItemIcon>
            <AppsIcon />
          </ListItemIcon>
          <ListItemText primary={"Home"} />
        </ListItem>
        <ListItem button key={"Turn On"} onClick={switchOpenMode}>
          <ListItemIcon>
            <AppsIcon />
          </ListItemIcon>
          <ListItemText primary={"Turn On"} />
        </ListItem>
      </List>
      <Divider />
    </div>
  );

  return (
    <div>
      <IconButton
        edge="start"
        className={classes.menuButton}
        color="inherit"
        aria-label="menu"
        onClick={toggleDrawer("left", true)}
      >
        <MenuIcon />
      </IconButton>
      <Drawer open={state.sideBarOpen} onClose={toggleDrawer("left", false)}>
        {sideList("left")}
      </Drawer>
    </div>
  );
}
