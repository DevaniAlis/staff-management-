import React, { useState } from "react";
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
import { useEffect } from "react";
import { Oval } from "react-loader-spinner";
import baseUrl from "../../views/baseUrl";

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

function Salary(props) {
  const [salaryOpen, setSalaryOpen] = useState(false);
  const token = localStorage.getItem("token");
  const [salaryList, setSalaryList] = useState([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [salaryToDelete, setSalaryToDelete] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editSalary, setEditSalary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [staffSalary, setStaffSalary] = useState({
    firstName: "",
    staffId: "",
    date: "",
    salary: "",
    note: "",
  });

  const addSalary = (ele) => {
    setStaffSalary({ ...staffSalary, [ele.target.name]: ele.target.value });
  };

  // const handleDatePicker = (type, newDate) => {
  //   const currentDate = new Date(newDate);
  //   const dateString = currentDate.toLocaleDateString("en-US");
  //   const formattedDate = moment(dateString).format("DD-MM-YYYY");

  //   setStaffSalary((prevState) => ({
  //     ...prevState,
  //     [type]: formattedDate,
  //   }));
  // };
  const handleDatePicker = (type, newDate) => {
    const currentDate = new Date(newDate);
    setEditSalary((prevState) => ({
      ...prevState,
      [type]: currentDate,
    }));
  };

  useEffect(() => {
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
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  const handleSalary = () => {
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

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
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
      console.log(editSalary);

      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          window.location.reload();
          setEditOpen(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  // const handleEditDatePicker = (type, newDate) => {
  //   const currentDate = new Date(newDate);
  //   const dateString = currentDate.toLocaleDateString("en-US");
  //   const formattedDate = moment(dateString).format("DD-MM-YYYY");

  //   setEditSalary((prevState) => ({
  //     ...prevState,
  //     [type]: formattedDate,
  //   }));
  // };
  console.log(editSalary);

  const handleEditClick = (item) => {
    console.log(item);
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
                  Salary Details
                </Typography>
              </Box>
              <Box>
                <Button
                  variant="contained"
                  onClick={() => setSalaryOpen(true)}
                  sx={addButtonStyle}
                  startIcon={<IconCirclePlus />}
                >
                  Add Salary
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
                      <TableCell align="center">Staff Name</TableCell>
                      <TableCell align="center">Salary</TableCell>
                      <TableCell align="center">Salary Date</TableCell>
                      <TableCell align="center">Notes</TableCell>
                      <TableCell align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {salaryList.map((item) => {
                      return (
                        <>
                          <TableRow key={item._id}>
                            <TableCell align="center">
                              {item.staffId ? `${item.staffId.firstName} ${item.staffId.lastName}` : ''}
                            </TableCell>
                            <TableCell align="center">{item.salary}</TableCell>
                            <TableCell align="center">
                              {new Date(item.date).getDate()}/
                              {new Date(item.date).getMonth()}/
                              {new Date(item.date).getFullYear()}
                            </TableCell>
                            <TableCell align="center">{item.note}</TableCell>
                            <TableCell align="center">
                              <Button
                                onClick={() => handleEditClick(item)}
                                disableRipple
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
              </TableContainer>
            </Grid>
          </Grid>
        </MainCard>
      )}
      {/* start salary dialog */}
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
              {/* <Grid md={12}>
                <TextField
                  sx={{ width: "100%" }}
                  placeholder="Staff Name"
                  label="Staff Name"
                  name="staffname"
                  onChange={addSalary}
                />
              </Grid> */}
              <Grid md={12} mt="12px">
                <TextField
                  sx={{ width: "100%" }}
                  placeholder="Staff Id"
                  label="Staff ID"
                  name="staffId"
                  onChange={addSalary}
                />
              </Grid>
              <Grid display="contents" mt={2}>
                <Grid md={6}>
                  <Box>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                          sx={{ width: "96%", mt: "4px" }}
                          label="Salary Date"
                          onChange={(newDate) =>
                            handleDatePicker("date", newDate)
                          }
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
                    name="salary"
                    onChange={addSalary}
                  />
                </Grid>
              </Grid>
              <Grid md={12} mt="12px">
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
              <Grid md={12}>
                <TextField
                  sx={{ width: "100%" }}
                  placeholder="Staff Name"
                  label="Staff Name"
                  value={`${editSalary?.staffId.firstName} ${editSalary?.staffId.lastName}`}
                  onChange={addSalary}
                />
              </Grid>
              <Grid display="contents" mt={2}>
                <Grid md={6}>
                  <Box>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                          sx={{ width: "96%", mt: "4px" }}
                          label="Salary Date"
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
                    name="salary"
                    value={editSalary?.salary || ""}
                    onChange={handleEditInputChange}
                  />
                </Grid>
              </Grid>
              <Grid md={12} mt="12px">
                <TextField
                  sx={{ width: "100%" }}
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
