import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import moment from "moment/moment";
import dayjs from "dayjs";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Box,
  Autocomplete,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import MainCard from "ui-component/cards/MainCard";
import { IconCirclePlus, IconPencil, IconTrash } from "@tabler/icons";
import { gridSpacing } from "store/constant";
import SearchSection from "layout/MainLayout/Header/SearchSection";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Oval } from "react-loader-spinner";

import baseUrl from "../baseUrl";
import { useNavigate } from "react-router";

// ==============================|| Employee  ||============================== //

const displayStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const addButtonStyle = {
  justifyContent: "flex-end",
  backgroundColor: "#5e35b1",
};

const saveButton = {
  "&:hover": {
    backgroundColor: "#5e35b1",
  },
  margin: "10px",
  width: "100px",
  marginLeft: "0px",
  backgroundColor: "#5e35b1",
};

const cancelButton = {
  "&:hover": {
    border: "1px solid #5e35b1",
    backgroundColor: "none",
  },
  margin: "10px",
  width: "100px",
  border: "1px solid #5e35b1",
  color: "#5e35b1",
};

const editDialog = {
  color: "#5e35b1",
  borderColor: "#5e35b1",
};

const deleteDialog = {
  padding: "5px 20px",
  backgroundColor: "#5e35b1",
  "&:hover": {
    backgroundColor: "#5e35b1",
  },
};

const hoverEffect = {
  padding: "0px",
  minWidth: "35px",
};

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 40,
  height: 23,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#5e35b1", // Change the background color here
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 20,
    height: 20,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

const useStyles = makeStyles((theme) => ({
  customButton: {
    backgroundColor: "#5e35b1",
    color: theme.palette.common.white,
    "&:hover": {
      backgroundColor: "#5e35b1", // Change to your desired hover color
    },
  },
}));

const Staff = () => {
  const classes = useStyles();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [filterData, setFilterData] = useState("");
  const [staff, setStaff] = useState(false);
  const [deleteStaffOpen, setDeleteStaffOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [editStaff, setEditStaff] = useState(false);
  const [editToStaff, setEditToStaff] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [validateError, setValidateError] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [staffDataList, setStaffDataList] = useState([]);
  const [filteredStaffDataList, setFilteredStaffDataList] = useState([]);
  const [isChecked, setIsChecked] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [staffData, setStaffData] = useState({
    firstName: "",
    type: "",
    lastName: "",
    middleName: "",
    gender: "male",
    description: "",
    phone: "",
    address: "",
    joinDate: "",
    salary: "",
    isActive: "true",
    refName: "",
  });

  const handleChangeValue = (event) => {
    setStaffData({ ...staffData, [event.target.name]: event.target.value });
  };

  const handleDatePicker = (ele) => {
    setSelectedDate(ele);
    const currentDate = new Date(ele);
    const dateString = currentDate.toLocaleDateString("en-US");
    const formattedDate = moment(dateString).format("DD-MMM-YYYY");
    setStaffData((prevState) => ({
      ...prevState,
      joinDate: formattedDate,
    }));
  };

  const validateFields = () => {
    const errors = {};
    const phoneNumberPattern = /^\d{10}$/;

    if (!staffData.firstName) {
      errors.firstName = "First Name is required";
    }

    if (!staffData.lastName) {
      errors.lastName = "Last Name is required";
    }

    if (!staffData.type) {
      errors.type = "staff Type is required";
    }

    if (!staffData.phone) {
      errors.phone = "Phone number is required.";
    } else if (!phoneNumberPattern.test(staffData.phone)) {
      errors.phone = "Invalid phone number.";
    }

    if (!staffData.salary) {
      errors.salary = "Salary is required.";
    } else if (isNaN(staffData.salary)) {
      errors.salary = "Salary must be a valid number.";
    }

    setValidateError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveData = (event) => {
    if (validateFields()) {
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
      axios.request(config).then((response) => {
        navigate(0);
      });
    }
  };

  useEffect(() => {
    getStaffList();
  }, []);

  const getStaffList = () => {
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
        setStaffDataList(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.response.data === "Invalid Token") {
          localStorage.clear();
          navigate = "/";
        }
      });
  };

  useEffect(() => {
    if (searchQuery) {
      const filteredData = staffDataList.filter((staff) => {
        // Assuming 'name' is a property of each staff object
        return staff.firstName
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      });
      setFilteredStaffDataList(filteredData);
    } else {
      setFilteredStaffDataList(staffDataList);
    }
  }, [searchQuery, staffDataList]);

  let rowCount = 0;

  useEffect(() => {
    if (filterData) {
      const filteredByType = staffDataList.filter(
        (item) => item.type.toLowerCase() === filterData.toLowerCase()
      );
      setFilteredStaffDataList(filteredByType);
    } else {
      setFilteredStaffDataList(staffDataList);
    }
  }, [filterData]);

  const handleSearch = () => {
    const query = searchQuery;
    const regex = new RegExp(query, "i");
    const filteredList = staffDataList.filter((item) =>
      regex.test(item.firstName)
    );
    if (filterData) {
      const combinedFilters = filteredList.filter(
        (item) => item.type.toLowerCase() === filterData.toLowerCase()
      );
      setFilteredStaffDataList(combinedFilters);
    } else {
      setFilteredStaffDataList(filteredList);
    }
  };

  const handleChecked = (event, staffId) => {
    const newCheckedValue = event.target.checked;
    const updatedStaffData = { isActive: newCheckedValue };

    const config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${baseUrl.url}/api/staff/${staffId}`,
      headers: {
        token: token,
        "Content-Type": "application/json",
      },
      data: updatedStaffData,
    };

    axios.request(config).then((response) => {
      setIsChecked(newCheckedValue);
    });
  };

  const staffDelete = (staffId) => {
    if (staffToDelete) {
      let config = {
        method: "delete",
        maxBodyLength: Infinity,
        url: `${baseUrl.url}/api/staff/${staffId}`,
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
      };
      axios.request(config).then((response) => {
        navigate(0);
      });
    }
  };

  const handleStaff = (staffId) => {
    setStaffToDelete(staffId);
    setDeleteStaffOpen(true);
  };

  const handleEditStaff = () => {
    if (editToStaff) {
      let config = {
        method: "put",
        maxBodyLength: Infinity,
        url: `${baseUrl.url}/api/staff/${editToStaff._id}`,
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
        data: editToStaff,
      };
      axios.request(config).then((response) => {
        navigate(0);
        setEditStaff(false);
      });
    }
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setEditToStaff((prevEditToStaff) => ({
      ...prevEditToStaff,
      [name]: value,
    }));
  };

  const handleEditClick = (item) => {
    setEditToStaff(item);
    const formattedDate = moment(item.joinDate, "YYYY-MM-DD");
    setEditStaff(true);
  };

  const uniqueStaffTypes = [
    ...new Set(staffDataList.map((item) => item.type.toLowerCase())),
  ];

  return (
    <>
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
                className={classes.customButton}
              >
                Add Staff
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ height: 2, bgcolor: "black", marginY: "20px" }} />
        <Grid container>
          <Grid marginRight={"15px"}>
            <SearchSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </Grid>
          <Grid>
            <style>
              {`
                      .MuiAutocomplete-listbox li:hover
                      {
                        color: #5e35b1;
                      },
                  `}
            </style>
            <Autocomplete
              fullWidth
              disablePortal
              id="combo-box-demo"
              options={uniqueStaffTypes}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Search By Staff Type" />
              )}
              onChange={(_, newValue) => setFilterData(newValue)}
            />
          </Grid>
        </Grid>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={12} sx={displayStyle}>
            <TableContainer sx={{ minWidth: "100%", borderRadius: "10px" }}>
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
                  wrapperClass="loader-wrapper"
                  visible={true}
                  ariaLabel="oval-loading"
                  secondaryColor="#673ab7"
                  strokeWidth={2}
                  strokeWidthSecondary={2}
                />
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">No</TableCell>
                      <TableCell align="center">Staff Name</TableCell>
                      <TableCell align="center">Staff Type</TableCell>
                      <TableCell align="center">Phone Number</TableCell>
                      <TableCell align="center">Salary</TableCell>
                      <TableCell align="center">Join Date</TableCell>
                      <TableCell align="center">Active</TableCell>
                      <TableCell align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredStaffDataList.map((item) => {
                      rowCount++;
                      return (
                        <>
                          <TableRow key={item.staffId}>
                            <TableCell align="center">{rowCount}</TableCell>
                            <TableCell align="center">
                              {`${item.firstName} ${item.lastName}`}
                            </TableCell>
                            <TableCell align="center">
                              {item.type && (
                                <Chip
                                  sx={{
                                    color: "#5e35b1",
                                  }}
                                  label={item.type}
                                  variant="outlined"
                                />
                              )}
                            </TableCell>
                            <TableCell align="center">{item.phone}</TableCell>
                            <TableCell align="center">{item.salary}</TableCell>
                            <TableCell align="center">
                              {moment(item.joinDate).format("DD-MM-YYYY")}
                            </TableCell>
                            <TableCell align="center">
                              <FormControlLabel
                                sx={{ display: "flex", justifyContent: "end" }}
                                control={
                                  <IOSSwitch
                                    sx={{ m: 1 }}
                                    defaultChecked={item.isActive}
                                    onChange={(event) =>
                                      handleChecked(event, item._id)
                                    }
                                  />
                                }
                              ></FormControlLabel>
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                onClick={() => handleEditClick(item)}
                                disableRipple
                                style={{ color: "#5e35b1" }}
                                sx={hoverEffect}
                              >
                                <IconPencil />
                              </Button>
                              <Button
                                onClick={() => handleStaff(item._id)}
                                disableRipple
                                sx={hoverEffect}
                              >
                                <IconTrash style={{ color: "#e51e25" }} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        </>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          </Grid>
        </Grid>
      </MainCard>

      {/* start add staff Dialog */}
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
                <Grid item md={12} sm={12} xs={12}>
                  <TextField
                    fullWidth
                    placeholder="First Name"
                    variant="outlined"
                    label="First Name"
                    onChange={handleChangeValue}
                    name="firstName"
                    error={!!validateError.firstName}
                    helperText={validateError.firstName}
                  />
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <TextField
                    sx={{ mt: "12px" }}
                    fullWidth
                    placeholder="Middle Name"
                    variant="outlined"
                    label="Middle Name"
                    onChange={handleChangeValue}
                    name="middleName"
                  />
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <TextField
                    sx={{ mt: "12px" }}
                    fullWidth
                    placeholder="Last Name"
                    variant="outlined"
                    label="Last Name"
                    onChange={handleChangeValue}
                    name="lastName"
                    error={!!validateError.lastName}
                    helperText={validateError.lastName}
                  />
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                  <TextField
                    fullWidth
                    placeholder="Staff Type"
                    label="Staff Type"
                    onChange={handleChangeValue}
                    name="type"
                    sx={{
                      mt: "12px",
                      marginRight: "10px",
                      "@media (max-width: 900px)": {
                        marginX: 0,
                      },
                    }}
                    error={!!validateError.type}
                    helperText={validateError.type}
                  />
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      sx={{
                        mt: "12px",
                        marginLeft: "10px",
                        width: "96%",
                        "@media (max-width: 900px)": {
                          marginLeft: 0,
                          width: "100%",
                        },
                      }}
                      format="DD-MM-YYYY"
                      fullWidth
                      label="Joining Date"
                      onChange={handleDatePicker}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item md={6} sm={12} xs={12} mt="12px">
                  <Box
                    sx={{
                      minWidth: 120,
                      "@media (max-width: 900px)": {
                        marginX: 0,
                      },
                    }}
                  >
                    <FormControl fullWidth>
                      <InputLabel>Gender</InputLabel>
                      <Select
                        name="gender"
                        label="Gender"
                        onChange={handleChangeValue}
                        defaultValue="male"
                      >
                        <MenuItem name="gender" value="male">
                          Male
                        </MenuItem>
                        <MenuItem name="gender" value="female">
                          Female
                        </MenuItem>
                        <MenuItem name="gender" value="other">
                          Other
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                  <TextField
                    sx={{
                      mt: "12px",
                      marginLeft: "10px",
                      width: "96%",
                      "@media (max-width: 900px)": {
                        marginLeft: "0",
                        width: "100%",
                      },
                    }}
                    fullWidth
                    placeholder="Phone Number"
                    label="Phone Number"
                    onChange={handleChangeValue}
                    name="phone"
                    error={!!validateError.phone}
                    helperText={validateError.phone}
                  />
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                  <TextField
                    sx={{
                      mt: "12px",
                      marginRight: "10px",
                      "@media (max-width: 900px)": {
                        marginX: 0,
                      },
                    }}
                    fullWidth
                    placeholder="Salary"
                    label="Salary"
                    onChange={handleChangeValue}
                    name="salary"
                    error={!!validateError.salary}
                    helperText={validateError.salary}
                  />
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                  <TextField
                    sx={{
                      mt: "12px",
                      marginLeft: "10px",
                      width: "96%",
                      "@media (max-width: 900px)": {
                        marginLeft: "0",
                        width: "100%",
                      },
                    }}
                    fullWidth
                    placeholder="Reference Name"
                    label="Reference Name"
                    onChange={handleChangeValue}
                    name="refName"
                  />
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <TextField
                    sx={{ mt: "12px" }}
                    fullWidth
                    placeholder="Address"
                    label="Address"
                    onChange={handleChangeValue}
                    name="address"
                  />
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <TextField
                    sx={{ mt: "12px" }}
                    fullWidth
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
      {/* End staff Dialog */}

      {/* start delete staff data */}
      <Dialog open={deleteStaffOpen} onClose={() => setDeleteStaffOpen(false)}>
        <DialogTitle sx={{ fontSize: "20px" }}>{"Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete ?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: "16px" }}>
          <Button
            sx={editDialog}
            onClick={() => setDeleteStaffOpen(false)}
            autoFocus
            variant="outlined"
          >
            CANCEL
          </Button>
          <Button
            sx={deleteDialog}
            onClick={() => staffDelete(staffToDelete)}
            variant="contained"
            disableElevation
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* end delete staff data  */}

      {/* start staff edit data */}
      <Dialog
        open={editStaff}
        maxWidth="sm"
        fullWidth={true}
        onClose={() => setEditStaff(false)}
      >
        <DialogTitle>
          <Typography sx={{ fontSize: "20px" }}>Edit Staff</Typography>
        </DialogTitle>
        <Divider sx={{ marginY: "2px", color: "black" }} />
        <DialogContent>
          <Box>
            <Grid container>
              <Grid container display="flex" justifyContent="space-between">
                <Grid item md={12} sm={12} xs={12}>
                  <TextField
                    fullWidth
                    placeholder="First Name"
                    variant="outlined"
                    label="First Name"
                    value={editToStaff?.firstName || ""}
                    name="firstName"
                    onChange={handleEditInputChange}
                  />
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <TextField
                    sx={{ mt: "12px" }}
                    fullWidth={true}
                    placeholder="Middle Name"
                    variant="outlined"
                    label="Middle Name"
                    value={editToStaff?.middleName || ""}
                    name="middleName"
                    onChange={handleEditInputChange}
                  />
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <TextField
                    sx={{ mt: "12px" }}
                    fullWidth
                    placeholder="Last Name"
                    variant="outlined"
                    label="Last Name"
                    value={editToStaff?.lastName || ""}
                    name="lastName"
                    onChange={handleEditInputChange}
                  />
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                  <TextField
                    sx={{
                      mt: "12px",
                      width: "100%",
                      "@media (max-width: 900px)": {
                        marginLeft: "0",
                        width: "100%",
                      },
                    }}
                    placeholder="Staff Type"
                    label="Staff Type"
                    value={editToStaff?.type || ""}
                    name="type"
                    onChange={handleEditInputChange}
                  />
                </Grid>
                <Grid item md={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      sx={{
                        mt: "12px",
                        marginLeft: "10px",
                        width: "96%",
                        "@media (max-width: 900px)": {
                          marginLeft: 0,
                          width: "100%",
                        },
                      }}
                      format="DD-MM-YYYY"
                      fullWidth
                      label="Join Date"
                      name="joinDate"
                      value={dayjs(
                        moment(editToStaff?.joinDate).format("YYYY-MM-DD")
                      )}
                      onChange={(newDate) =>
                        handleEditInputChange({
                          target: {
                            name: "joinDate",
                            value: newDate ? newDate.format("YYYY-MM-DD") : "",
                          },
                        })
                      }
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
              <Grid display="contents">
                <Grid md={6} sm={12} xs={12} mt="12px">
                  <Box
                    sx={{
                      minWidth: 120,
                      "@media (max-width: 900px)": {
                        width: "100%",
                        marginX: 0,
                      },
                    }}
                  >
                    <FormControl fullWidth>
                      <InputLabel>Gender</InputLabel>
                      <Select
                        label="Gender"
                        value={editToStaff ? editToStaff.gender : ""}
                        onChange={handleEditInputChange}
                        name="gender"
                      >
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                  <TextField
                    sx={{
                      mt: "12px",
                      marginLeft: "10px",
                      width: "96%",
                      "@media (max-width: 900px)": {
                        marginLeft: "0",
                        width: "100%",
                      },
                    }}
                    fullWidth
                    placeholder="Phone Number"
                    label="Phone Number"
                    value={editToStaff?.phone || ""}
                    name="phone"
                    onChange={handleEditInputChange}
                  />
                </Grid>
              </Grid>
              <Grid display="contents" mt={2}>
                <Grid item md={6} sm={12} xs={12}>
                  <TextField
                    sx={{
                      mt: "12px",
                      width: "100%",
                      "@media (max-width: 900px)": {
                        marginLeft: "0",
                        width: "100%",
                      },
                    }}
                    placeholder="Salary"
                    label="Salary"
                    value={editToStaff?.salary || ""}
                    name="salary"
                    onChange={handleEditInputChange}
                  />
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                  <TextField
                    sx={{
                      mt: "12px",
                      marginLeft: "10px",
                      width: "96%",
                      "@media (max-width: 900px)": {
                        marginLeft: "0",
                        width: "100%",
                      },
                    }}
                    fullWidth
                    placeholder="Reference Name"
                    label="Reference Name"
                    value={editToStaff?.refName || ""}
                    name="refName"
                    onChange={handleEditInputChange}
                  />
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <TextField
                    sx={{ mt: "12px" }}
                    fullWidth
                    placeholder="Address"
                    label="Address"
                    value={editToStaff?.address || ""}
                    name="address"
                    onChange={handleEditInputChange}
                  />
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <TextField
                    sx={{ mt: "12px" }}
                    fullWidth
                    placeholder="Description"
                    label="Description"
                    value={editToStaff?.description || ""}
                    name="description"
                    onChange={handleEditInputChange}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ display: "flex" }}>
          <Button onClick={handleEditStaff} sx={saveButton} variant="contained">
            Save
          </Button>
          <Button
            sx={cancelButton}
            variant="outlined"
            onClick={() => {
              setEditStaff(false);
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {/* end start edit staff data */}
    </>
  );
};

export default Staff;
