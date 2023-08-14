import React, { useState } from "react";
import axios from "axios";
import moment from "moment/moment";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  MenuItem,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import {
  IconCirclePlus,
  IconDotsVertical,
  IconPencil,
  IconTrash,
} from "@tabler/icons";
import { gridSpacing } from "store/constant";
import SearchSection from "layout/MainLayout/Header/SearchSection";
import { Box } from "@mui/system";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect } from "react";
import { Oval } from "react-loader-spinner";

import baseUrl from "../baseUrl";
// ==============================|| Employee ||============================== //

const displayStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const addButtonStyle = {
  justifyContent: "flex-end",
};

const saveButton = {
  "&:hover": {
    backgroundColor: "#1E88E5",
  },
  margin: "10px",
  width: "100px",
  marginLeft: "0px",
  backgroundColor: "#1E88E5",
};

const cancelButton = {
  "&:hover": {
    border: "1px solid #1E88E5",
    backgroundColor: "none",
  },
  margin: "10px",
  width: "100px",
  border: "1px solid #1E88E5",
  color: "#000000",
};

const loaderSet = {
  position: "absolute",
  top: "60%",
  left: "60%",
};

const Staff = () => {
  const [open, setOpen] = useState(null);
  const [staff, setStaff] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = (event) => {
    setOpen(null);
  };

  const [staffData, setStaffData] = useState({
    staffId: "",
    firstName: "",
    lastName: "",
    middleName: "",
    gender: "",
    description: "",
    position: "",
    email: "",
    phone: "",
    address: "",
    aadhaarNo: "",
    pancardNo: "",
    bankName: "",
    accountNo: "",
    ifscCode: "",
    salary: "",
  });

  const handleChangeValue = (event) => {
    setStaffData({ ...staffData, [event.target.name]: event.target.value });
  };

  const handleDatePicker = (ele) => {
    const currentDate = new Date(ele);
    const dateString = currentDate.toLocaleDateString("en-US");
    const formattedDate = moment(dateString).format("DD-MMM-YYYY");
    setStaffData((prevState) => ({
      ...prevState,
      joinDate: formattedDate,
    }));
  };

  console.log(staffData);

  const handleSaveData = (event) => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseUrl.url}/api/staff`,
      headers: {
        token: token,
        "Content-Type": "application/json",
      },
      data: staffData,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [staffDataList, setStaffDataList] = useState([]);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl.url}/api/staff/list`,
      headers: {
        token: token,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        setStaffDataList(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      {isLoading ? (
        <Oval
          height={50}
          width={50}
          color="#673ab7"
          wrapperStyle={{
            position: "absolute",
            top: "52%",
            left: "55%",
          }}
          wrapperClass=""
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#673ab7"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      ) : (
        <MainCard>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} sm={12} sx={displayStyle}>
              <Box>
                <Typography variant="h3" gutterBottom>
                  Staff
                </Typography>
              </Box>
              <Box>
                <Button
                  variant="contained"
                  onClick={() => setStaff(true)}
                  sx={addButtonStyle}
                  startIcon={<IconCirclePlus />}
                >
                  Add Staff
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ height: 2, bgcolor: "black", marginY: "20px" }} />
          <SearchSection />
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} sm={12} sx={displayStyle}>
              <TableContainer sx={{ minWidth: "100%", borderRadius: "10px" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Employee ID</TableCell>
                      <TableCell align="center">Employee Name</TableCell>
                      <TableCell align="center">Position</TableCell>
                      <TableCell align="center">Phone Number</TableCell>
                      <TableCell align="center">Salary</TableCell>
                      <TableCell align="center">Join Date</TableCell>
                      <TableCell align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {staffDataList.map((item) => {
                      return (
                        <>
                          <TableRow>
                            <TableCell align="center">{item.staffId}</TableCell>
                            <TableCell align="center">
                              {item.firstName}
                            </TableCell>
                            <TableCell align="center">
                              {item.position}
                            </TableCell>
                            <TableCell align="center">{item.phone}</TableCell>
                            <TableCell align="center">{item.salary}</TableCell>
                            <TableCell align="center">
                              {new Date(item.joinDate).toLocaleDateString(
                                "en-us"
                              )}
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                size="large"
                                color="inherit"
                                onClick={handleOpenMenu}
                              >
                                <IconDotsVertical
                                  icon={"eva:more-vertical-fill"}
                                />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        </>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </MainCard>
      )}

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            "& .MuiMenuItem-root": {
              px: 1,
              typography: "body2",
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          <IconPencil style={{ marginRight: "8px" }} />
          Edit
        </MenuItem>

        <MenuItem style={{ color: "red" }}>
          <IconTrash style={{ marginRight: "8px" }} />
          Delete
        </MenuItem>
      </Popover>
      {/* start add Employees Dialog */}
      <Dialog
        open={staff}
        maxWidth="sm"
        fullWidth={true}
        onClose={() => setStaff(false)}
      >
        <DialogTitle>
          <Typography sx={{ fontSize: "20px" }}>Add Staff</Typography>
        </DialogTitle>
        <Divider sx={{ marginY: "2px", color: "black" }} />
        <DialogContent>
          <Box>
            <Grid container>
              <Grid container display="flex" justifyContent="space-between">
                <Grid item md={12}>
                  <TextField
                    sx={{ mt: "8px", width: "100%" }}
                    placeholder="First Name"
                    variant="outlined"
                    label="First Name"
                    onChange={handleChangeValue}
                    name="firstName"
                  />
                </Grid>
                <Grid item md={12}>
                  <TextField
                    sx={{ mt: "12px", width: "100%" }}
                    placeholder="Middle Name"
                    variant="outlined"
                    label="Middle Name"
                    onChange={handleChangeValue}
                    name="lastName"
                  />
                </Grid>
                <Grid item md={12}>
                  <TextField
                    sx={{ mt: "12px", width: "100%" }}
                    placeholder="Last Name"
                    variant="outlined"
                    label="Last Name"
                    onChange={handleChangeValue}
                    name="middleName"
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    sx={{ mt: "12px", width: "96%" }}
                    placeholder="Staff ID"
                    label="Staff ID"
                    onChange={handleChangeValue}
                    name="staffId"
                  />
                </Grid>
                <Grid item md={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        sx={{ width: "100%", mt: "4px" }}
                        label="Joining Date"
                        onChange={handleDatePicker}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>
                <Grid item md={6}>
                  <TextField
                    sx={{ mt: "12px", width: "96%" }}
                    placeholder="Gender"
                    label="Gender"
                    onChange={handleChangeValue}
                    name="gender"
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    sx={{ mt: "12px", width: "100%" }}
                    placeholder="Position"
                    label="Position"
                    onChange={handleChangeValue}
                    name="position"
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    sx={{ mt: "12px", width: "96%" }}
                    placeholder="Email ID"
                    label="Email ID"
                    onChange={handleChangeValue}
                    name="email"
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    sx={{ mt: "12px", width: "100%" }}
                    placeholder="Phone Number"
                    label="Phone Number"
                    onChange={handleChangeValue}
                    name="phone"
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    sx={{ mt: "12px", width: "96%" }}
                    placeholder="Aadhaar Number"
                    label="Aadhaar Number"
                    onChange={handleChangeValue}
                    name="aadhaarNo"
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    sx={{ mt: "12px", width: "100%" }}
                    placeholder="Pancard Number"
                    label="Pancard Number"
                    onChange={handleChangeValue}
                    name="pancardNo"
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    sx={{ mt: "12px", width: "96%" }}
                    placeholder="Bank Name"
                    label="Bank Name"
                    onChange={handleChangeValue}
                    name="bankName"
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    sx={{ mt: "12px", width: "100%" }}
                    placeholder="Account Number"
                    label="Account Number"
                    onChange={handleChangeValue}
                    name="accountNo"
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    sx={{ mt: "12px", width: "96%" }}
                    placeholder="Ifsc Code"
                    label="Ifsc Code"
                    onChange={handleChangeValue}
                    name="ifscCode"
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    sx={{ mt: "12px", width: "100%" }}
                    placeholder="Salary"
                    label="Salary"
                    onChange={handleChangeValue}
                    name="salary"
                  />
                </Grid>
                <Grid item md={12}>
                  <TextField
                    sx={{ mt: "12px", width: "100%" }}
                    placeholder="Address"
                    label="Address"
                    onChange={handleChangeValue}
                    name="address"
                  />
                </Grid>
                <Grid item md={12}>
                  <TextField
                    sx={{ mt: "12px", width: "100%" }}
                    placeholder="Description"
                    label="Description"
                    onChange={handleChangeValue}
                    name="description"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ display: "flex" }}>
          <Button sx={saveButton} variant="contained" onClick={handleSaveData}>
            Save
          </Button>
          <Button
            sx={cancelButton}
            variant="outlined"
            onClick={() => setStaff(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {/* End Employees Dialog */}
    </>
  );
};

export default Staff;
