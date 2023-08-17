import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment/moment";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
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
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
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

const editDialog = {
  color: "#000000",
};

const deleteDialog = {
  padding: "5px 20px",
};

const hoverEffect = {
  "&:hover": {
    backgroundColor: "transparent",
  },
  padding: "0px",
  minWidth: "35px",
};

const loaderSet = {
  position: "absolute",
  top: "60%",
  left: "60%",
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
        backgroundColor: theme.palette.mode === "dark" ? "#1e88e5" : "#1e88e5",
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

const Staff = () => {
  const token = localStorage.getItem("token");
  const [open, setOpen] = useState(null);
  const [staff, setStaff] = useState(false);
  const [deleteStaffOpen, setDeleteStaffOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [editStaff, setEditStaff] = useState(false);
  const [editToStaff, setEditToStaff] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStaffDataList, setFilteredStaffDataList] = useState([]);
  const [isChecked, setIsChecked] = useState(true);

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

  const handleSaveData = (event) => {
    console.log(staffData);
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
        console.log(error);
      });
  };

  useEffect(() => {
    getStaffList();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredStaffDataList(staffDataList);
    } else {
      handleSearch();
    }
  }, [searchQuery, staffDataList]);

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    const numberQuery = Number(searchQuery);

    const filteredList = staffDataList.filter((item) => {
      console.log("Item Phone:", item.phone);
      if (item.phone === numberQuery || item.firstName === query) {
        return item.phone;
      }
      return false;
    });
    setFilteredStaffDataList(filteredList);
  };

  const handleChecked = (event, staffId) => {
    const newCheckedValue = event.target.checked;
    const updatedStaffData = {isActive: newCheckedValue };
    console.log(updatedStaffData);

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
    

    axios
      .request(config)
      .then((response) => {
        console.log("Status updated successfully:", response.data);
        setIsChecked(newCheckedValue);
      })
      .catch((error) => {
        console.log("Error updating status:", error);
      });
    
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

      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleStaff = (staffId) => {
    setStaffToDelete(staffId);
    setDeleteStaffOpen(true);
  };

  const handleStaffEdit = () => {
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

      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          window.location.reload();
          setStaff(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setEditToStaff((prevEditSalary) => ({
      ...prevEditSalary,
      [name]: value,
    }));
  };

  const handleEditClick = (item) => {
    setEditToStaff(item);
    setEditStaff(true);
  };

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
          <SearchSection
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} sm={12} sx={displayStyle}>
              <TableContainer sx={{ minWidth: "100%", borderRadius: "10px" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Staff Name</TableCell>
                      <TableCell align="center">Position</TableCell>
                      <TableCell align="center">Phone Number</TableCell>
                      <TableCell align="center">Salary</TableCell>
                      <TableCell align="center">Join Date</TableCell>
                      <TableCell align="center">Active</TableCell>
                      <TableCell align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredStaffDataList.map((item) => {
                      return (
                        <>
                          <TableRow key={item.staffId}>
                            <TableCell align="center">
                              {`${item.firstName} ${item.lastName}`}
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
                            <TableCell align="center">
                            <FormControlLabel
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
              </TableContainer>
            </Grid>
          </Grid>
        </MainCard>
      )}
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
          <Typography sx={{ fontSize: "20px" }}>Edit Transaction</Typography>
        </DialogTitle>
        <Divider sx={{ marginY: "2px", color: "black" }} />
        <DialogContent>
          <Box>
            <Grid container>
              <Grid md={12}>
                <TextField
                  sx={{ width: "100%" }}
                  placeholder="Staff Name"
                  label="Staff Name"
                  onChange={handleChangeValue}
                  value={`${editToStaff?.firstName} ${editToStaff?.lastName}`}
                />
              </Grid>
              <Grid display="contents" mt={2}>
                <Grid md={6}>
                  <TextField
                    sx={{ mt: "12px", width: "96%" }}
                    placeholder="Position"
                    label="Position"
                    value={editToStaff?.position || ""}
                    name="position"
                    onChange={handleEditInputChange}
                  />
                </Grid>
                <Grid md={6}>
                  <TextField
                    sx={{ mt: "12px", width: "100%" }}
                    placeholder="Phone Number"
                    label="Phone Number"
                    value={editToStaff?.phone || ""}
                    name="phone"
                    onChange={handleEditInputChange}
                  />
                </Grid>
              </Grid>
              <Grid display="contents" mt={2}>
                <Grid md={6}>
                  <Box>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                          sx={{ width: "96%", mt: "4px" }}
                          label="Join Date"
                          // value={editSalary?.date || null}
                          // onChange={(newDate) =>
                          //   handleEditDatePicker("date", newDate)
                          // }
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </Box>
                </Grid>
                <Grid md={6}>
                  <TextField
                    sx={{ mt: "12px", width: "100%" }}
                    placeholder="Salary"
                    label="Salary"
                    value={editToStaff?.salary || ""}
                    name="salary"
                    onChange={handleEditInputChange}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ display: "flex" }}>
          <Button onClick={handleStaffEdit} sx={saveButton} variant="contained">
            Save
          </Button>
          <Button
            sx={cancelButton}
            variant="outlined"
            onClick={() => {
              // setEditSalary(null);
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
