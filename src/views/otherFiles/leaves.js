import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import {
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
import baseUrl from "../../views/baseUrl";

import baseUrl from "../baseUrl";
const token = localStorage.getItem("token");

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

function Leaves(props) {
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
    firstName: "",
    lastName: "",
    staffId: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  // const addLeave = (ele) => {
  //   setStaffLeave({ ...staffLeave, [ele.target.name]: ele.target.value });
  // };
  const addLeave = (event) => {
    const { name, value } = event.target;
    setStaffLeave((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDatePicker = (ele) => {
    const currentDate = new Date(ele);
    const dateString = currentDate.toLocaleDateString("en-US");
    const formattedDate = moment(dateString).format("DD-MMM-YYYY");
    staffLeave((prevState) => ({
      ...prevState,
      joinDate: formattedDate,
    }));
  };
  // const handleDatePicker = (type, newDate) => {
  //   const currentDate = new Date(newDate);
  //   setStaffLeave((prevState) => ({
  //     ...prevState,
  //     [type]: currentDate,
  //   }));
  // };

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
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  console.log("staff leave", staffLeave);

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
          console.log(JSON.stringify(response.data));
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
          // window.location.reload();
          setEditOpen(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleEditClick = (item) => {
    setEditLeave(item);
    setEditOpen(true);
  };

  const handleEditDatePicker = (type, newDate) => {
    const formattedDate = moment(newDate).format("DD-MMM-YYYY");
    setEditLeave((prevEditLeave) => ({
      ...prevEditLeave,
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
    const query = searchQuery;
    const numberQuery = Number(searchQuery);

    const filteredList = staffLeaveList.filter((item) => {
      console.log("Item Phone:", item.phone);
      if (item.phone === numberQuery || item.firstName === query) {
        return item.phone;
      }
      return false;
    });
    setFilteredStaffDataList(filteredList);
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
                  Leave Details
                </Typography>
              </Box>
              <Box>
                <Button
                  variant="contained"
                  sx={addButtonStyle}
                  startIcon={<IconCirclePlus />}
                  onClick={() => setLeaveOpen(true)}
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
              </TableContainer>
            </Grid>
          </Grid>
        </MainCard>
      )}
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
              <Grid md={12}>
                <TextField
                  sx={{ width: "100%" }}
                  label="Staff ID"
                  placeholder="Staff Id"
                  onChange={addLeave}
                  name="staffId"
                />
              </Grid>
              <Grid display="contents" mt={2}>
                <Grid md={6}>
                  <Box>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                          sx={{ width: "96%", mt: "4px" }}
                          label=" Leave From Date"
                          value={editLeave?.startDate || null}
                          onChange={(newDate) =>
                            handleDatePicker("startDate", newDate)
                          }
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </Box>
                </Grid>
                <Grid md={6}>
                  <Box>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                          sx={{ width: "100%", mt: "4px" }}
                          label="Leave to Date"
                          value={editLeave?.endDate || null}
                          onChange={(newDate) =>
                            handleDatePicker("endDate", newDate)
                          }
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </Box>
                </Grid>
              </Grid>
              <Grid md={12} mt="12px">
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
              <Grid item md={12}>
                <TextField
                  sx={{ width: "100%" }}
                  label="Staff ID"
                  placeholder="Staff Id"
value={
                    editLeave
                      ? `${editLeave.staffId.firstName} ${editLeave.staffId.lastName}`
                      : ""
                  }
                  name="staffId"
                  onChange={addLeave}
                />
              </Grid>
              <Grid display="contents" mt={2}>
                <Grid item md={6}>
                  <Box>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                          sx={{ width: "96%", mt: "4px" }}
                          label=" Leave From Date"
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </Box>
                </Grid>
                <Grid item md={6}>
                  <Box>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                          sx={{ width: "100%", mt: "4px" }}
                          label="Leave to Date"
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </Box>
                </Grid>
              </Grid>
              <Grid item md={12} mt="12px">
                <TextField
                  sx={{ width: "100%" }}
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
