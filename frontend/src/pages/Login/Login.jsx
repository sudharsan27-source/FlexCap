import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import RecyclingRoundedIcon from "@mui/icons-material/RecyclingRounded";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import axios from "axios";
import { getPort } from "../../commonFunctions";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="">
        FlexCap
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function Login() {
  const [path, setPath] = React.useState({ apiUrl: getPort() });
  const [loading, setLoading] = React.useState(false);
  const [loginInfo, setLoginInfo] = useState({});
  const [errorInfo, setErrorInfo] = useState({
    email: {
      error: false,
      message: "",
    },
    password: {
      error: false,
      message: "",
    },
  });
  const [alert, setAlert] = React.useState({ type: false, message: "" });
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      setLoading(true);
      const data = new FormData(event.currentTarget);
      let email = data.get("email");
      let password = data.get("password");

      let isValid = checkValidation(email, password);

      if (isValid) {
        setLoginInfo({
          email: data.get("email"),
          password: data.get("password"),
        });
        let obj = {
          email,
          password,
        };

        const result = await axios.post(`${path.apiUrl}/login`, obj);
        if (result.status === 200) {
          console.log(result);
          setLoading(false);
          sessionStorage.setItem("userInfo", JSON.stringify(result.data));
          // navigate("/dashboard");
        }
      } else {
        setLoading(false);
      }
    } catch (ex) {
      setLoading(false);
      if (ex.response.status === 404) {
        setAlert({
          type: "error",
          message: "User Not Found !!!",
        });
      } else if (ex.response.status === 401) {
        setAlert({
          type: "error",
          message: "Invalid Password!!!",
        });
      }
      console.log("Error in handleSubmit function", ex);
    }
  };

  const checkValidation = (email, password) => {
    let valid = true;
    const errors = {
      email: { error: false, message: "" },
      password: { error: false, message: "" },
    };

    if (!email || email.trim().length === 0) {
      errors.email = { error: true, message: "Enter email" };
      valid = false;
    }
    if (!password || password.trim().length === 0) {
      errors.password = { error: true, message: "Enter password" };
      valid = false;
    }
    setErrorInfo(errors);
    return valid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({ ...prev, [name]: value }));

    // Clear error message for the field being edited
    if (value.trim().length > 0) {
      setErrorInfo((prev) => ({
        ...prev,
        [name]: { error: false, message: "" },
      }));
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar> */}
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              error={errorInfo.email.error || false}
              helperText={errorInfo.email.message || ""}
              value={loginInfo.email || ""}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              error={errorInfo.password.error || false}
              helperText={errorInfo.password.message || ""}
              value={loginInfo.password || ""}
              onChange={handleInputChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Login"}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link component={RouterLink} to="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            {alert && (
              <Alert severity={alert.type || ""} sx={{ mt: 2 }}>
                {alert.message || ""}
              </Alert>
            )}
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
