/* eslint-disable react/prop-types */
import * as React from "react";
const { useState, useRef } = React;
import { styled, useTheme, Theme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Avatar from "@mui/material/Avatar";
import logo from "../assets/logo.png";
import { Menus, MenuItem, MenuList } from "./Menus";
import { useNavigate, useLocation } from "react-router-dom";
import { Typography } from "@mui/material";
import { UilSignout } from "@iconscout/react-unicons";

const drawerWidth = 300;

interface AppBarProps {
  open: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }: { theme: Theme } & AppBarProps) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

interface SidebarProps {
  children: ReactNode;
  title: string;
}

export default function Sidebar({ children, title }: SidebarProps): JSX.Element {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState<boolean>(true);
  const [menuCollapseStates, setMenuCollapseStates] = useState<boolean[]>(
    Menus.map(() => false)
  );

  const isLinkActive = (path: string): boolean => location.pathname === path;

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleCollapse = (index: number) => {
    // Toggle the collapse state for the clicked menu item
    const updatedCollapseStates = [...menuCollapseStates];
    updatedCollapseStates[index] = !updatedCollapseStates[index];
    setMenuCollapseStates(updatedCollapseStates);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        sx={{
          bgcolor: "#05184C",
          borderBottom: "1px solid #E0E2E9",
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <div
            className="head"
            style={{ display: "flex", alignItems: "center" }}
          >
            <IconButton
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                mr: 1,
                ...(open && { display: "none" }),
                color: "var(--black)",
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: "light", mt: 0.3 }}>
              {title}
            </Typography>
          </div>
          <div className="tail">
            <IconButton
              variant="outlined"
              color="error"
              onClick={() => navigate("/")}
            >
              <UilSignout />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader sx={{ display: "flex", justifyContent: "space-between" }}>
          <div className="head" style={{ display: "flex" }}>
            <Avatar
              variant="square"
              sx={{ bgcolor: "#E0E2E9" }}
              alt="Remy Sharp"
              src={logo}
            />
            <Typography style={{ marginLeft: "10px", fontSize: "14px" }}>
              COMee Sales <br /> MAVEKO
            </Typography>
          </div>
          <div className="tail">
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </div>
        </DrawerHeader>
        <Divider />
        <List>
          {Menus.map((menuItem: MenuItem, index: number) => (
            <>
              {menuItem.type === "main_menu" ? (
                <React.Fragment key={index}>
                  <ListItem
                    disablePadding
                    sx={{ display: "block" }}
                    onClick={() => handleCollapse(index)}
                  >
                    <ListItemButton
                      onClick={() => {
                        if (menuItem.action) {
                          navigate("/landing");
                        }
                      }}
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center",
                        }}
                      >
                        {menuItem.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={menuItem.title}
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                      {menuItem.action ? null : menuCollapseStates[index] ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </ListItemButton>
                  </ListItem>
                  <Collapse
                    in={menuCollapseStates[index]}
                    timeout="auto"
                    unmountOnExit
                  >
                    {menuItem.lists &&
                      menuItem.lists.map((list: MenuList, listIndex: number) => (
                        <ListItem
                          key={listIndex}
                          disablePadding
                          sx={{ display: "block" }}
                        >
                          <ListItemButton
                            sx={{
                              minHeight: 48,
                              marginInline: 1,
                              justifyContent: open ? "initial" : "center",
                              px: 4,
                              ...(isLinkActive(list.path) && {
                                bgcolor: "#04184B",
                                color: "white",
                                borderRadius: 2,
                                "&:hover": {
                                  bgcolor: "#04184B",
                                },
                              }),
                            }}
                            onClick={() => navigate(list.path)}
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: 0,
                                mr: open ? 3 : "auto",
                                justifyContent: "center",
                                ...(isLinkActive(list.path) && {
                                  color: "white",
                                }),
                              }}
                            >
                              {list.icon}
                            </ListItemIcon>
                            <ListItemText
                              primary={list.text}
                              sx={{ opacity: open ? 1 : 0 }}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                  </Collapse>
                </React.Fragment>
              ) : (
                <>
                  <React.Fragment key={index}>
                    <ListItem
                      disablePadding
                      sx={{ display: "block" }}
                      onClick={() => handleCollapse(index)}
                    >
                      {" "}
                      <ListItemButton
                        sx={{
                          minHeight: 48,
                          justifyContent: open ? "initial" : "center",
                          px: 2.5,

                          ...(isLinkActive(menuItem.path) && {
                            bgcolor: "#096ac9",
                            color: "white",
                            borderRadius: 2,
                            "&:hover": {
                              bgcolor: "#8fa9c2",
                            },
                          }),
                        }}
                        onClick={() => navigate(menuItem.path)}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            justifyContent: "center",
                          }}
                        >
                          {menuItem.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={menuItem.title}
                          sx={{ opacity: open ? 1 : 0 }}
                        />
                      </ListItemButton>
                    </ListItem>
                  </React.Fragment>
                </>
              )}
            </>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: "margin 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
          marginLeft: open ? 0 : -38,
        }}
      >
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
