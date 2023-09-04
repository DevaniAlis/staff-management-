import { useState } from "react";
import axios from "axios";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Snackbar,
  Typography,
} from "@mui/material";

// assets
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import baseUrl from "../../baseUrl";

// ============================|| FIREBASE - LOGIN ||============================ //

const FirebaseLogin = ({ ...others }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [login, setLogin] = useState({
    username: "",
    password: "",
  });
  const [token, setToken] = useState();

  if (token) {
    window.location.href = "/";
  }

  const handleChange = (event) => {
    setLogin({ ...login, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors({ username: "", password: "" });
    if (!login.username) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        username: "Username is required",
      }));
    }
    if (!login.password) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password is required",
      }));
    }
    if (login.username && login.password) {
      setLoading(true);
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${baseUrl.url}/api/login`,
        headers: {
          "Content-Type": "application/json",
        },
        data: login,
      };
      axios
        .request(config)
        .then((response) => {
          console.log(response.data);
          setToken(response.data.data);
          localStorage.setItem("token", response.data.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          if (error.response.data.status == false) {
            setSnackbarOpen(true);
            setLoading(false);
          }
        });
    }
  };

  return (
    <>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          please Enter Valid Username and Password
        </Alert>
      </Snackbar>
      <Grid container direction="column" justifyContent="center" spacing={2}>
        <Grid item xs={12}>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
            }}
          >
            <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          container
          alignItems="center"
          justifyContent="center"
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Sign in with Username</Typography>
          </Box>
        </Grid>
      </Grid>

      <form onSubmit={handleSubmit}>
        <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
          <InputLabel htmlFor="outlined-adornment-email-login">
            Username
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-email-login"
            type="name"
            name="username"
            onChange={handleChange}
            label="Username"
          />
          {errors.username && (
            <Typography variant="caption" color="error">
              {errors.username}
            </Typography>
          )}
        </FormControl>

        <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
          <InputLabel htmlFor="outlined-adornment-password-login">
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password-login"
            type={showPassword ? "text" : "password"}
            name="password"
            onChange={handleChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                  size="large"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
            inputProps={{}}
          />
          {errors.password && (
            <Typography variant="caption" color="error">
              {errors.password}
            </Typography>
          )}
        </FormControl>
        <FormControl fullWidth>
          <Box sx={{ mt: 2 }}>
            <Button
              disableElevation
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="secondary"
            >
              {loading ? (
                <CircularProgress color="inherit" />
              ) : (
                <span>SIGN IN</span>
              )}
            </Button>
          </Box>
        </FormControl>
      </form>
    </>
  );
};

export default FirebaseLogin;
