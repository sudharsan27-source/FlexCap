import * as React from "react";
import { useEffect } from "react";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import { Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";

const Header = () => {
  const { setSelectedNav, selectedNav, isLoading, setIsLoading } =
    useContext(AuthContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [auth, setAuth] = React.useState(null);
  // const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    getSessionValue();
    setSelectedNav(sessionStorage.getItem("navbar") || "Dashboard");
  }, []);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const navigate = useNavigate();

  const navList = ["Dashboard", "Issues", "Project", "Report", "Admin"];

  const getSessionValue = () => {
    try {
      let user = JSON.parse(sessionStorage.getItem("auth"));
      setAuth(user);
    } catch (Ex) {
      console.log("Error in get session value", Ex);
    }
  };

  const handleNavClick = (item) => {
    setIsLoading(true);
    setSelectedNav(item);
    sessionStorage.setItem("navbar", item);
    navigate(`/${item}`);

    // Simulate a delay (e.g., API call, navigation delay)
    setTimeout(() => {
      setIsLoading(false);
    }, 500); // Adjust the delay as needed
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleLogout = () => {
    try {
      // sessionStorage.removeItem("auth");
      sessionStorage.clear();
      navigate("/");
    } catch (ex) {
      console.log("Error in handleLogout", ex);
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const stringToColor = (string) => {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  };

  const stringAvatar = (name) => {
    return {
      sx: {
        // bgcolor: stringToColor(name),
        bgcolor: "#333",
        fontSize: "1.2rem",
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      <hr />
      <MenuItem onClick={handleLogout}>Log Out</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {sessionStorage.getItem("auth") &&
        navList.map((item, index) => (
          <MenuItem key={index} onClick={handleMenuClose}>
            {item}
          </MenuItem>
        ))}
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 4 new mails"
          sx={{ color: "black" }}
        >
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          sx={{ color: "black" }}
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          sx={{ color: "black" }}
        >
          <Avatar {...stringAvatar(`${auth?.firstName} ${auth?.lastName}`)} />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  const filteredNavList = navList.filter((item) => {
    if (item === "Admin") {
      return auth?.isAdmin;
    }
    return true;
  });

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "white",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Toolbar sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}>
          <IconButton
            size="large"
            edge="start"
            sx={{ color: "black", mr: 2 }}
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" }, color: "black" }}
          >
            FLEXCAP
          </Typography>
          {sessionStorage.getItem("auth") && (
            <>
              <div>
                <ul>
                  {filteredNavList.map((item, index) => (
                    <Typography
                      variant="h6"
                      noWrap
                      component="li"
                      key={index}
                      style={{
                        display: "inline-block",
                        padding: "0px 10px",
                        fontSize: "1.2rem",
                        background: selectedNav === item ? "#333333" : "white",
                        color: selectedNav === item ? "white" : "#333333",
                        cursor: "pointer",
                        border:
                          selectedNav === item
                            ? "1px solid rgba(0, 0, 0, 0.12)"
                            : "none",
                        borderRadius: selectedNav === item ? "8px" : "none",
                      }}
                      onClick={() => handleNavClick(item)}
                    >
                      {item}
                    </Typography>
                  ))}
                </ul>
              </div>
              <Box sx={{ flexGrow: 1 }} />
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <IconButton
                  size="large"
                  aria-label="show 4 new mails"
                  sx={{ color: "black" }}
                >
                  <Badge badgeContent={4} color="error">
                    <MailIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  size="large"
                  aria-label="show 17 new notifications"
                  sx={{ color: "black" }}
                >
                  <Badge badgeContent={`9+`} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  sx={{ color: "black" }}
                >
                  <Avatar
                    {...stringAvatar(`${auth?.firstName} ${auth?.lastName}`)}
                  />
                </IconButton>
              </Box>
              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                  sx={{ color: "black" }}
                >
                  <MoreIcon />
                </IconButton>
              </Box>{" "}
            </>
          )}
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
};

export default Header;
