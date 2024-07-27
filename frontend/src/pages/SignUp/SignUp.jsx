import * as React from "react";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import axios from "axios";
import { getPort } from "../../commonFunctions";

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

const defaultTheme = createTheme();

const SignUp = () => {
  const [path, setPath] = React.useState({ apiUrl: getPort() });
  const [loading, setLoading] = useState(false);
  const [signUpInfo, setSignUpInfo] = useState({});
  const [errorInfo, setErrorInfo] = useState({
    firstName: {
      error: false,
      message: "",
    },
    lastName: {
      error: false,
      message: "",
    },
    email: {
      error: false,
      message: "",
    },
    password: {
      error: false,
      message: "",
    },
    confirmpassword: {
      error: false,
      message: "",
    },
  });

  const handleSubmit = async (event) => {

    debugger
    try {
      event.preventDefault();
      setLoading(true);
      const data = new FormData(event.currentTarget);
      let firstName = data.get("firstName");
      let lastName = data.get("lastName");
      let email = data.get("email");
      let password = data.get("password");
      let confirmpassword = data.get("confirmpassword");
      let isValid = checkValidation(
        firstName,
        lastName,
        email,
        password,
        confirmpassword
      );

      if (isValid) {
        setSignUpInfo({
          firstName: data.get("firstName"),
          lastName: data.get("lastName"),
          email: data.get("email"),
          password: data.get("password"),
        });
        let obj = {
          firstName,
          lastName,
          email,
          password,
        };
        
        const result = await axios.post(
          `${path.apiUrl}/register`,
          obj
        );
        if (result.status === 200) {
          console.log(result.data);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
      
    } catch (ex) {
      setLoading(false);
      console.log("Error in handleSubmit function", ex);
    }
  };

  const checkValidation = (   
    firstName,
    lastName,
    email,
    password,
    confirmpassword
  ) => {
    let valid = true;
    const errors = {
      firstName: { error: false, message: "" },
      lastName: { error: false, message: "" },
      email: { error: false, message: "" },
      password: { error: false, message: "" },
      confirmpassword: { error: false, message: "" },
    };

    if (!firstName || firstName.trim().length === 0) {
      errors.firstName = { error: true, message: "Enter first name" };
      valid = false;
    }
    if (!lastName || lastName.trim().length === 0) {
      errors.lastName = { error: true, message: "Enter last name" };
      valid = false;
    }
    if (!email || email.trim().length === 0) {
      errors.email = { error: true, message: "Enter email" };
      valid = false;
    }
    if (!password || password.trim().length === 0) {
      errors.password = { error: true, message: "Enter password" };
      valid = false;
    }
    if (!confirmpassword || confirmpassword.trim().length === 0) {
      errors.confirmpassword = {
        error: true,
        message: "Enter confirm password",
      };
      valid = false;
    }
    if (password !== confirmpassword) {
      errors.confirmpassword = {
        error: true,
        message: "Password not match",
      };
      valid = false;
    }
    setErrorInfo(errors);
    return valid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignUpInfo((prev) => ({ ...prev, [name]: value }));

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
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  error={errorInfo.firstName.error}
                  helperText={errorInfo.firstName.message}
                  value={signUpInfo.firstName || ""}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  error={errorInfo.lastName.error}
                  helperText={errorInfo.lastName.message}
                  value={signUpInfo.lastName || ""}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  error={errorInfo.email.error}
                  helperText={errorInfo.email.message}
                  value={signUpInfo.email || ""}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  error={errorInfo.password.error}
                  helperText={errorInfo.password.message}
                  value={signUpInfo.password || ""}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmpassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmpassword"
                  autoComplete="new-password"
                  error={errorInfo.confirmpassword.error}
                  helperText={errorInfo.confirmpassword.message}
                  value={signUpInfo.confirmpassword || ""}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Sign Up"}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  Already have an account? Login
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
};

export default SignUp;
