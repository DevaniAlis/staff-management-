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
import baseUrl from "../../views/baseUrl";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router";

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
  "&:hover" : {
    backgroundColor: "#5e35b1",
  }
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

function Salary(props) {
  const navigate = useNavigate();
  const classes = useStyles();
  const [salaryOpen, setSalaryOpen] = useState(false);
  const token = localStorage.getItem("token");
  const [salaryList, setSalaryList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [salaryToDelete, setSalaryToDelete] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editSalary, setEditSalary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStaffDataList, setFilteredStaffDataList] = useState([]);
  const [staffSalary, setStaffSalary] = useState({
    staffId: null,
    salary: "",
    note: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    staffId: "",
    salary: "",
    note: "",
  });

  const [datePickerError, setDatePickerError] = useState("");

  const addSalary = (ele) => {
    setStaffSalary({ ...staffSalary, [ele.target.name]: ele.target.value });
  };

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
        if (error.response.data === "Invalid Token") {
          localStorage.clear();
          navigate = "/";
        }
      });
  }, []);

  const handleDatePicker = (ele) => {
    const currentDate = new Date(ele);
    const dateString = currentDate.toLocaleDateString("en-US");
    const formattedDate = moment(dateString).format("DD-MMM-YYYY");
    setStaffSalary((prevState) => ({
      ...prevState,
      date: formattedDate,
    }));
  };

  const allSalaryList = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,

      url: `${baseUrl.url}/api/salary/list`,
      headers: {
        token: token,
        "Content-Type": "application/json",
      },
    };
    setIsLoading(true);
    axios
      .request(config)
      .then((response) => {
        setSalaryList(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const handleSalary = () => {
    const errors = {};

    if (!staffSalary.salary) {
      errors.salary = "Salary amount is required.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseUrl.url}/api/salary`,
      headers: {
        token: token,
        "Content-Type": "application/json",
      },
      data: staffSalary,
    };
    setSalaryOpen(false);
    axios.request(config).then((response) => {
      window.location.reload();
    });
  };

  const deleteSalary = (staffId) => {
    if (salaryToDelete) {
      let config = {
        method: "delete",
        maxBodyLength: Infinity,
        url: `${baseUrl.url}/api/salary/${staffId}`,
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
      };
      axios.request(config).then((response) => {
        window.location.reload();
      });
    }
  };

  const handleDeleteOpen = (staffId) => {
    setSalaryToDelete(staffId);
    setDeleteOpen(true);
  };

  const editStaffSalary = () => {
    if (editSalary) {
      let config = {
        method: "put",
        maxBodyLength: Infinity,
        url: `${baseUrl.url}/api/salary/${editSalary._id}`,
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
        data: editSalary,
      };

      axios.request(config).then((response) => {
        window.location.reload();
        setEditOpen(false);
      });
    }
  };
  const handleSelectChangeValue = (event, newValue) => {
    setStaffSalary({
      ...staffSalary,
      staffId: newValue ? newValue._id : null,
    });
  };

  const handleEditClick = (item) => {
    setEditSalary(item);
    setEditOpen(true);
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setEditSalary((prevEditSalary) => ({
      ...prevEditSalary,
      [name]: value,
    }));
  };

  useEffect(() => {
    allSalaryList();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredStaffDataList(salaryList);
    } else {
      handleSearch();
    }
  }, [searchQuery, salaryList]);

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();

    const filteredList = salaryList.filter((item) =>
      item.staffId.firstName.toLowerCase().includes(query)
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
                Salary Details
              </Typography>
            </Box>
            <Box>
              <Button
                variant="contained"
                onClick={() => setSalaryOpen(true)}
                sx={addButtonStyle}
                startIcon={<IconCirclePlus />}
                className={classes.customButton}
              >
                Add Salary
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
                      <TableCell align="center">Salary</TableCell>
                      <TableCell align="center">Salary Date</TableCell>
                      <TableCell align="center">Notes</TableCell>
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
                            <TableCell align="center">{item.salary}</TableCell>
                            <TableCell align="center">
                              {moment(item.date).format("DD-MM-YYYY")}
                            </TableCell>
                            <TableCell align="center">{item.note}</TableCell>
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
                                onClick={() => handleDeleteOpen(item._id)}
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

      {/* start Add salary dialog */}
      <Dialog
        open={salaryOpen}
        maxWidth="sm"
        fullWidth={true}
        onClose={() => setSalaryOpen(false)}
      >
        <DialogTitle>
          <Typography sx={{ fontSize: "20px" }}>Add Salary</Typography>
        </DialogTitle>
        <Divider sx={{ marginY: "2px", color: "black" }} />
        <DialogContent>
          <Box>
            <Grid container>
              <style>
                {`
                      .MuiAutocomplete-listbox li:hover
                      {
                        color: #5e35b1;
                      },
                  `}
              </style>
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
                      (staff) => staff._id === staffSalary.staffId
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
              <Grid display="contents" mt={2}>
                <Grid md={6} sm={12} xs={12} mt="4px">
                  <Box>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                          fullWidth
                          sx={{
                            width: "96%",
                            mt: "4px",
                            "@media (max-width: 900px)": {
                              width: "100%",
                              marginRight: 0,
                            },
                          }}
                          label="Salary Date"
                          onChange={handleDatePicker}
                          format="DD-MM-YYYY"
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </Box>
                </Grid>
                <Grid md={6} sm={12} xs={12}>
                  <TextField
                    sx={{ mt: "12px", width: "100%" }}
                    placeholder="Salary"
                    label="Salary"
                    name="salary"
                    onChange={addSalary}
                    error={!!validationErrors.salary}
                    helperText={validationErrors.salary}
                  />
                </Grid>
              </Grid>
              <Grid md={12} sm={12} xs={12} mt="12px">
                <TextField
                  sx={{ width: "100%" }}
                  placeholder="Notes"
                  label="Notes"
                  name="note"
                  onChange={addSalary}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ display: "flex" }}>
          <Button onClick={handleSalary} sx={saveButton} variant="contained">
            Save
          </Button>
          <Button
            sx={cancelButton}
            variant="outlined"
            onClick={() => setSalaryOpen(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {/* end salary dialog */}

      {/* delete staff salary data */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle sx={{ fontSize: "20px" }}>{"Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete ?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: "16px" }}>
          <Button
            sx={editDialog}
            onClick={() => setDeleteOpen(false)}
            autoFocus
            variant="outlined"
          >
            CANCEL
          </Button>
          <Button
            sx={deleteDialog}
            onClick={() => deleteSalary(salaryToDelete)}
            variant="contained"
            disableElevation
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* start edit staff salary dialog */}
      <Dialog
        open={editOpen}
        maxWidth="sm"
        fullWidth={true}
        onClose={() => setEditOpen(false)}
      >
        <DialogTitle>
          <Typography sx={{ fontSize: "20px" }}>Edit Salary</Typography>
        </DialogTitle>
        <Divider sx={{ marginY: "2px", color: "black" }} />
        <DialogContent>
          <Box>
            <Grid container>
              <Grid md={12} sm={12} xs={12}>
                <TextField
                  sx={{
                    width: "100%",
                    pointerEvents: "none",
                    cursor: "default",
                  }}
                  placeholder="Staff Name"
                  label="Staff Name"
                  value={`${editSalary?.staffId?.firstName || ""} ${
                    editSalary?.staffId?.lastName || ""
                  }`}
                  onChange={addSalary}
                />
              </Grid>
              <Grid display="contents">
                <Grid md={6} sm={12} xs={12} mt="4px">
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
                          label="Salary Date"
                          value={dayjs(
                            moment(editSalary?.date).format("YYYY-MM-DD")
                          )}
                          onChange={(newDate) =>
                            handleEditInputChange({
                              target: {
                                name: "date",
                                value: newDate
                                  ? newDate.format("YYYY-MM-DD")
                                  : "",
                              },
                            })
                          }
                          format="DD-MM-YYYY"
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </Box>
                </Grid>
                <Grid md={6} sm={12} xs={12}>
                  <TextField
                    sx={{ mt: "12px" }}
                    fullWidth
                    placeholder="Salary"
                    label="Salary"
                    name="salary"
                    value={editSalary?.salary || ""}
                    onChange={handleEditInputChange}
                  />
                </Grid>
              </Grid>
              <Grid md={12} sm={12} xs={12} mt="12px">
                <TextField
                  fullWidth
                  placeholder="Notes"
                  label="Notes"
                  name="note"
                  value={editSalary?.note || ""}
                  onChange={handleEditInputChange}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ display: "flex" }}>
          <Button onClick={editStaffSalary} sx={saveButton} variant="contained">
            Save
          </Button>
          <Button
            sx={cancelButton}
            variant="outlined"
            onClick={() => {
              setEditSalary(null);
              setEditOpen(false);
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Salary;
