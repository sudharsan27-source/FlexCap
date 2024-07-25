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

const SignUp = () => {
  const [loading, setLoading] = React.useState(false);
  const [signUpInfo, setSignUpInfo] = useState({});

  const handleSubmit = (event) => {
    try {
      debugger;
      event.preventDefault();
      setLoading(true);
      const data = new FormData(event.currentTarget);
      let firstName = data.get("firstName");
      let lastName = data.get("lastName");
      let email = data.get("email");
      let password = data.get("password");
      let confirmpassword = data.get("confirmpassword");
      let isValidted = checkValidation(
        firstName,
        lastName,
        email,
        password,
        confirmpassword
      );
      if (isValidted) {
        setSignUpInfo((prev) => ({
          ...prev,
          firstName: data.get("firstName"),
          lastName: data.get("lastName"),
          email: data.get("email"),
          password: data.get("password"),
        }));
      } else {
        setLoading(false);
      }
      // Simulate a network request
      setTimeout(() => {
        setLoading(false);
        // Handle form submission here
      }, 2000);
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
    if (
      firstName === undefined ||
      firstName === null ||
      firstName.trim().length === 0
    ) {
      alert("Enter firstName");
      return false;
    } else if (
      lastName === undefined ||
      lastName === null ||
      lastName.trim().length === 0
    ) {
      alert("Enter lastName");
      return false;
    } else if (
      email === undefined ||
      email === null ||
      email.trim().length === 0
    ) {
      alert("Enter email");
      return false;
    } else if (
      password === undefined ||
      password === null ||
      password.trim().length === 0
    ) {
      alert("Enter password");
      return false;
    } else if (
      confirmpassword === undefined ||
      confirmpassword === null ||
      confirmpassword.trim().length === 0
    ) {
      alert("Enter confirmpassword");
      return false;
    }

    return true;
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
