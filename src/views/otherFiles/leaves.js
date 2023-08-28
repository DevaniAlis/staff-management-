import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import dayjs from "dayjs";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
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
import { IconCirclePlus, IconPencil, IconTrash } from "@tabler/icons";
import { gridSpacing } from "store/constant";
import SearchSection from "layout/MainLayout/Header/SearchSection";
import { Box } from "@mui/system";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Oval } from "react-loader-spinner";
import { makeStyles } from "@mui/styles";
import baseUrl from "../baseUrl";
import { useNavigate } from "react-router";
const token = localStorage.getItem("token");

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
  color:"#5e35b1",
};

const editDialog = {
  color: "#5e35b1",
  borderColor: "#5e35b1",
};

const deleteDialog = {
  padding: "5px 20px",
  backgroundColor:"#5e35b1",
};

const hoverEffect = {
  "&:hover": {
    backgroundColor: "transparent",
  },
  padding: "0px",
  minWidth: "35px",
};

const useStyles = makeStyles((theme) => ({
  customButton: {
    backgroundColor: "#5e35b1",
    color: theme.palette.common.white,
    "&:hover": {
      backgroundColor: "#5e35b1", // Change to your desired hover color
    },
  },
}));

function Leaves(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");
  const [deleteLeaveOpen, setDeleteLeaveOpen] = useState(false);
  const [leaveToDelete, setLeaveToDElete] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editLeave, setEditLeave] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStaffDataList, setFilteredStaffDataList] = useState([]);
  const [staffLeave, setStaffLeave] = useState({
    staffId: null,
    reason: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    staffId: "",
  });
  const addLeave = (event) => {
    const { name, value } = event.target;
    setStaffLeave((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDatePicker = (type, ele) => {
    const currentDate = new Date(ele);
    const dateString = currentDate.toLocaleDateString("en-US");
    const formattedDate = moment(dateString).format("DD-MMM-YYYY");
    setStaffLeave((prevState) => ({
      ...prevState,
      [type]: formattedDate,
    }));
  };

  const [staffList, setStaffList] = useState([]);
  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl.url}/api/staff/list`,
      headers: {
        token: token,
        "Content-Type": "application/json",
      },
    };
    axios
      .request(config)
      .then((response) => {
        setStaffList(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [staffLeaveList, setStaffLeaveList] = useState([]);

  const getLeaveList = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl.url}/api/leave/list`,
      headers: {
        token: token,
        "Content-Type": "application/json",
      },
    };
    setIsLoading(true);
    axios
      .request(config)
      .then((response) => {
        setStaffLeaveList(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  const handleLeave = () => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseUrl.url}/api/leave`,
      headers: {
        token: token,
      },
      data: staffLeave,
    };
    setLeaveOpen(false);
    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        navigate(0);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteLeave = (staffId) => {
    if (leaveToDelete) {
      let config = {
        method: "delete",
        maxBodyLength: Infinity,
        url: `${baseUrl.url}/api/leave/${staffId}`,
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
      };
      axios
        .request(config)
        .then((response) => {
          console.log(response.data);
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleLeaveOpen = (staffId) => {
    setLeaveToDElete(staffId);
    setDeleteLeaveOpen(true);
  };

  const editStaffLeave = () => {
    if (editLeave) {
      let config = {
        method: "put",
        maxBodyLength: Infinity,
        url: `${baseUrl.url}/api/leave/${editLeave._id}`,
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
        data: editLeave,
      };
      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          const updatedList = staffLeaveList.map((item) =>
            item._id === editLeave._id ? editLeave : item
          );
          setStaffLeaveList(updatedList);
          window.location.reload();
          setEditOpen(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleSelectChangeValue = (event, newValue) => {
    setStaffLeave({
      ...staffLeave,
      staffId: newValue ? newValue._id : null,
    });
  };

  const handleEditClick = (item) => {
    setEditLeave(item);
    setEditOpen(true);
  };

  const handleEditDatePicker = (type, ele) => {
    const currentDate = new Date(ele);
    const dateString = currentDate.toLocaleDateString("en-US");
    const formattedDate = moment(dateString).format("DD-MMM-YYYY");
    setEditLeave((prevState) => ({
      ...prevState,
      [type]: formattedDate,
    }));
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setEditLeave((prevEditLeave) => ({
      ...prevEditLeave,
      [name]: value,
    }));
  };

  useEffect(() => {
    getLeaveList();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredStaffDataList(staffLeaveList);
    } else {
      handleSearch();
    }
  }, [searchQuery, staffLeaveList]);

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    const filteredList = staffLeaveList.filter((item) =>
      item.staffId.firstName.includes(query)
    );
    setFilteredStaffDataList(filteredList);
  };

  return (
    <>
      <MainCard>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={12} sx={displayStyle}>
            <Box>
              <Typography variant="h3" gutterBottom>
                Leave Details
              </Typography>
            </Box>
            <Box>
              <Button
                variant="contained"
                sx={addButtonStyle}
                startIcon={<IconCirclePlus />}
                onClick={() => setLeaveOpen(true)}
                className={classes.customButton}
              >
                Add Leave
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
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Staff Name</TableCell>
                      <TableCell align="center">Start Date</TableCell>
                      <TableCell align="center">End Date</TableCell>
                      <TableCell align="center">Reason</TableCell>
                      <TableCell align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredStaffDataList.map((item) => {
                      return (
                        <>
                          <TableRow key={item._id}>
                            <TableCell align="center">
                              {item.staffId
                                ? `${item.staffId.firstName} ${item.staffId.lastName}`
                                : ""}
                            </TableCell>
                            <TableCell align="center">
                              {moment(item.startDate).format("DD/MM/YYYY")}
                            </TableCell>
                            <TableCell align="center">
                              {moment(item.endDate).format("DD/MM/YYYY")}
                            </TableCell>
                            <TableCell align="center">{item.reason}</TableCell>
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
                                onClick={() => handleLeaveOpen(item._id)}
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

      {/* start add leave dialog */}
      <Dialog
        open={leaveOpen}
        maxWidth="sm"
        fullWidth={true}
        onClose={() => setLeaveOpen(false)}
      >
        <DialogTitle>
          <Typography sx={{ fontSize: "20px" }}>Add Leave</Typography>
        </DialogTitle>
        <Divider sx={{ marginY: "2px", color: "black" }} />
        <DialogContent>
          <Box>
            <Grid container>
              <Grid md={12} sm={12} xs={12}>
                <Autocomplete
                  fullWidth
                  disablePortal
                  id="combo-box-demo"
                  options={staffList}
                  getOptionLabel={(staff) =>
                    `${staff.firstName} ${staff.lastName}`
                  }
                  getOptionSelected={(option, value) =>
                    option._id === value._id
                  }
                  value={
                    staffList.find(
                      (staff) => staff._id === staffLeave.staffId
                    ) || null
                  }
                  onChange={(event, newValue) =>
                    handleSelectChangeValue(event, newValue)
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Staff Name" name="staffId" />
                  )}
                />
              </Grid>
              <Grid display="contents">
                <Grid md={6} sm={12} xs={12} mt="4px">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        sx={{
                          width: "96%",
                          mt: "4px",
                          "@media (max-width: 900px)": {
                            width: "100%",
                          },
                        }}
                        label=" Leave From Date"
                        value={editLeave?.startDate || null}
                        onChange={(newDate) =>
                          handleDatePicker("startDate", newDate)
                        }
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>
                <Grid md={6} sm={12} xs={12} mt="4px">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        fullWidth
                        sx={{ width: "100%" }}
                        label="Leave to Date"
                        value={editLeave?.endDate || null}
                        onChange={(newDate) =>
                          handleDatePicker("endDate", newDate)
                        }
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>
              </Grid>
              <Grid md={12} sm={12} xs={12} mt="12px">
                <TextField
                  sx={{ width: "100%" }}
                  placeholder="Leave Reason"
                  label="Leave Reason"
                  onChange={addLeave}
                  name="reason"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ display: "flex" }}>
          <Button onClick={handleLeave} sx={saveButton} variant="contained">
            Save
          </Button>
          <Button
            sx={cancelButton}
            variant="outlined"
            onClick={() => setLeaveOpen(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {/* end leave dialog */}

      {/* delete staff leave data */}
      <Dialog open={deleteLeaveOpen} onClose={() => setDeleteLeaveOpen(false)}>
        <DialogTitle sx={{ fontSize: "20px" }}>{"Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete ?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: "16px" }}>
          <Button
            sx={editDialog}
            onClick={() => setDeleteLeaveOpen(false)}
            autoFocus
            variant="outlined"
          >
            CANCEL
          </Button>
          <Button
            sx={deleteDialog}
            onClick={() => deleteLeave(leaveToDelete)}
            variant="contained"
            disableElevation
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* start edit staff leave data */}
      <Dialog
        open={editOpen}
        maxWidth="sm"
        fullWidth={true}
        onClose={() => setEditOpen(false)}
      >
        <DialogTitle>
          <Typography sx={{ fontSize: "20px" }}>Edit Leave</Typography>
        </DialogTitle>
        <Divider sx={{ marginY: "2px", color: "black" }} />
        <DialogContent>
          <Box>
            <Grid container>
              <Grid item md={12} sm={12} xs={12}>
                <TextField
                  sx={{
                    width: "100%",
                    pointerEvents: "none",
                    cursor: "default",
                  }}
                  label="Staff Name"
                  placeholder="Staff Name"
                  value={
                    editLeave && editLeave.staffId
                      ? `${editLeave.staffId.firstName} ${editLeave.staffId.lastName}`
                      : ""
                  }
                  name="staffId"
                  onChange={addLeave}
                />
              </Grid>
              <Grid display="contents">
                <Grid item md={6} sm={12} xs={12} mt="4px">
                  <Box>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                          sx={{
                            width: "96%",
                            mt: "4px",
                            "@media (max-width: 900px)": {
                              width: "100%",
                            },
                          }}
                          label=" Leave From Date"
                          value={dayjs(
                            moment(editLeave?.startDate).format("YYYY-MM-DD")
                          )}
                          onChange={(newDate) =>
                            handleEditInputChange({
                              target: {
                                name: "startDate",
                                value: newDate
                                  ? newDate.format("YYYY-MM-DD")
                                  : "",
                              },
                            })
                          }
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </Box>
                </Grid>
                <Grid item md={6} sm={12} xs={12} mt="4px">
                  <Box>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                          sx={{ width: "100%", mt: "4px" }}
                          label="Leave to Date"
                          value={dayjs(
                            moment(editLeave?.endDate).format("YYYY-MM-DD")
                          )}
                          onChange={(newDate) =>
                            handleEditInputChange({
                              target: {
                                name: "endDate",
                                value: newDate
                                  ? newDate.format("YYYY-MM-DD")
                                  : "",
                              },
                            })
                          }
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </Box>
                </Grid>
              </Grid>
              <Grid item md={12} sm={12} xs={12} mt="12px">
                <TextField
                  fullWidth
                  placeholder="Leave Reason"
                  label="Leave Reason"
                  value={editLeave?.reason || ""}
                  onChange={handleEditInputChange}
                  name="reason"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ display: "flex" }}>
          <Button onClick={editStaffLeave} sx={saveButton} variant="contained">
            Save
          </Button>
          <Button
            sx={cancelButton}
            variant="outlined"
            onClick={() => setEditOpen(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Leaves;
