import React, { useState } from "react";
import axios from "axios";
import moment from "moment";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
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

const hoverEffect = {
  "&:hover": {
    backgroundColor: "transparent",
  },
  padding: "0px",
  minWidth: "35px",
};

const editDialog = {
  color: "#000000",
};

const deleteDialog = {
  padding: "5px 20px",
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

const Transaction = () => {
  const [transaction, setTransaction] = useState(false);
  const [transactionOpen, setTransactionOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [editTransaction, setEditTransaction] = useState(false);
  const [editToTransaction, setEditToTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [staffList, setStaffList] = useState([]);
  const [validateError, setValidateError] = useState({});

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStaffDataList, setFilteredStaffDataList] = useState([]);

  const token = localStorage.getItem("token");
  const [transactionsData, setTransactionsData] = useState({
    staffId: "",
    transactionType: "",
    amount: "",
    description: "",
  });

  const handleChangeValue = (event) => {
    setTransactionsData({
      ...transactionsData,
      [event.target.name]: event.target.value,
    });
  };


  const handleSelectChangeValue = (event, newValue) => {
    setTransactionsData({
      ...transactionsData,
      staffId: newValue ? newValue._id : "",
    });
  };
  // console.log(transactionsData);

  const handleDatePicker = (ele) => {
    const currentDate = new Date(ele);
    const dateString = currentDate.toLocaleDateString("en-US");
    const formattedDate = moment(dateString).format("DD-MMM-YYYY");
    setTransactionsData((prevState) => ({
      ...prevState,
      transactionDate: formattedDate,
    }));
  };
  const validateFields = () => {
    const errors = {};
    if (!transactionsData.amount) {
      errors.amount = "Amount is required";
    }

    setValidateError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveData = (event) => {
    if (validateFields()) {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${baseUrl.url}/api/transaction`,
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
        data: transactionsData,
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

  const [transactionList, setTransactionList] = useState([]);

  const getTransactionList = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl.url}/api/transaction/list`,
      headers: {
        token: token,
        "Content-Type": "application/json",
      },
    };
    axios
      .request(config)
      .then((response) => {

        setTransactionList(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error.response.data);
        // if()
      });
  };

  useEffect(() => {
    getTransactionList();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredStaffDataList(transactionList);
    } else {
      handleSearch();
    }
  }, [searchQuery, transactionList]);

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    console.log(query);

    const filteredList = transactionList.filter((item) => {
      const firstName = (item.staffId.firstName).toLowerCase();
      if (firstName === query) {
        return item;
      }
      return false;
    });
    console.log("filteredList", filteredList);
    setFilteredStaffDataList(filteredList);
  };

  const transactionDelete = (staffId) => {
    if (transactionToDelete) {
      let config = {
        method: "delete",
        maxBodyLength: Infinity,
        url: `${baseUrl.url}/api/transaction/${staffId}`,
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
          console.log(error.response.data);
        });
    }
  };

  const handleTransactionOpen = (staffId) => {
    setTransactionToDelete(staffId);
    setTransactionOpen(true);
  };

  const handleEditTransaction = () => {
    if (editToTransaction) {
      let config = {
        method: "put",
        maxBodyLength: Infinity,
        url: `${baseUrl.url}/api/transaction/${editToTransaction._id}`,
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
        data: editToTransaction,
      };
      axios
        .request(config)
        .then((response) => {
          window.location.reload();
          setTransaction(false);
        })
        .catch((error) => {
          // console.log(error.response.data);
        });
    }
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    console.log(event.target);
    setEditToTransaction((prevEditSalary) => ({
      ...prevEditSalary,
      [name]: value,
    }));
  };

  const handleEditClick = (item) => {
    setEditToTransaction(item);
    setEditTransaction(true);
  };

  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
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
                  Transaction
                </Typography>
              </Box>
              <Box>
                <Button
                  variant="contained"
                  onClick={() => setTransaction(true)}
                  sx={addButtonStyle}
                  startIcon={<IconCirclePlus />}
                >
                  Add Transaction
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ height: 2, bgcolor: "black", marginY: "20px" }} />

          <Box display="flex" justifyContent="space-between">
            <SearchSection />
            <FormControl
              sx={{
                width: "340px",
                "@media (max-width: 1200px)": {
                  marginX: "20px",
                  width: "240px",
                },
              }}
            >
              <InputLabel id="demo-simple-select-label">Month</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                label="Month"
                onChange={handleChange}
              >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
            <FormControl
              sx={{
                width: "340px",
                "@media (max-width: 1200px)": {
                  marginX: "20px",
                  width: "230px",
                },
              }}
            >
              <InputLabel id="demo-simple-select-label">Year</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                label="Year"
                onChange={handleChange}
              >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Box>

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
                      <TableCell align="center">Transaction Type</TableCell>
                      <TableCell align="center">Transaction Date</TableCell>
                      <TableCell align="center">Amount</TableCell>
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
                              {item.transactionType}
                            </TableCell>
                            <TableCell align="center">
                              {new Date(
                                item.transactionDate
                              ).toLocaleDateString("en-us")}
                            </TableCell>
                            <TableCell align="center">{item.amount}</TableCell>
                            <TableCell align="center">
                              <Button
                                onClick={() => handleEditClick(item)}
                                disableRipple
                                sx={hoverEffect}
                              >
                                <IconPencil />
                              </Button>
                              <Button
                                onClick={() => handleTransactionOpen(item._id)}
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

      {/* start Add Transaction Dialog */}
      <Dialog
        open={transaction}
        maxWidth="sm"
        fullWidth={true}
        onClose={() => setTransaction(false)}
      >
        <DialogTitle>
          <Typography sx={{ fontSize: "20px" }}>Add Transaction</Typography>
        </DialogTitle>
        <Divider sx={{ marginY: "2px", color: "black" }} />
        <DialogContent>
          <Box>
            <Grid container>

              <Grid md={12}>
                <Autocomplete
                  disablePortal
                  options={staffList}
                  getOptionLabel={(staff) =>
                    `${staff.firstName} ${staff.lastName}`
                  }
                  getOptionSelected={(option, value) =>
                    option._id === value._id
                  }
                  value={
                    staffList.find(
                      (staff) => staff._id === transactionsData.staffId
                    ) || null
                  }
                  onChange={(event, newValue) =>
                    handleSelectChangeValue(event, newValue)
                  }
                  sx={{ width: "100%" }}
                  renderInput={(params) => (
                    <TextField {...params} label="Staff Name" name="staffId" />
                  )}
                />
              </Grid>
              <Grid md={12} mt="4px">

              <Grid md={12} sm={12} xs={12}>

                <Box>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        sx={{ width: "100%", mt: "4px" }}
                        label="Transaction Date"
                        onChange={handleDatePicker}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Box>
              </Grid>
              <Grid display="contents" mt={2}>
                <Grid md={6} sm={12} xs={12}>
                  <TextField
                    sx={{
                      mt: "12px",
                      width: "96%",
                      "@media (max-width: 900px)": {
                        width: "100%",
                      },
                    }}
                    placeholder="Transaction Type"
                    label="Transaction Type"
                    onChange={handleChangeValue}
                    name="transactionType"
                  />
                </Grid>
                <Grid md={6} sm={12} xs={12}>
                  <TextField
                    sx={{ mt: "12px", width: "100%" }}
                    placeholder="Amount"
                    label="Amount"
                    onChange={handleChangeValue}
                    name="amount"
                    error={!!validateError.amount}
                    helperText={validateError.amount}
                  />
                </Grid>
              </Grid>
              <Grid md={12} sm={12} xs={12} mt="12px">
                <TextField
                  sx={{ width: "100%" }}
                  placeholder="Description"
                  label="Description"
                  onChange={handleChangeValue}
                  name="description"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ display: "flex" }}>
          <Button onClick={handleSaveData} sx={saveButton} variant="contained">
            Save
          </Button>
          <Button
            sx={cancelButton}
            variant="outlined"
            onClick={() => setTransaction(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {/* End Add Transaction Dialog */}

      {/* start transaction delete data */}
      <Dialog open={transactionOpen} onClose={() => setTransactionOpen(false)}>
        <DialogTitle sx={{ fontSize: "20px" }}>{"Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete ?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: "16px" }}>
          <Button
            sx={editDialog}
            onClick={() => setTransactionOpen(false)}
            autoFocus
            variant="outlined"
          >
            CANCEL
          </Button>
          <Button
            sx={deleteDialog}
            onClick={() => transactionDelete(transactionToDelete)}
            variant="contained"
            disableElevation
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* end transaction delete data */}

      {/* start edit transaction data */}
      <Dialog
        open={editTransaction}
        maxWidth="sm"
        fullWidth={true}
        onClose={() => setEditTransaction(false)}
      >
        <DialogTitle>
          <Typography sx={{ fontSize: "20px" }}>Edit Transaction</Typography>
        </DialogTitle>
        <Divider sx={{ marginY: "2px", color: "black" }} />
        <DialogContent>
          <Box>
            <Grid container>
              <Grid md={12} sm={12} xs={12}>
                <TextField
                  fullWidth
                  placeholder="Staff Name"
                  label="Staff Name"
                  onChange={handleChangeValue}
                  value={`${editToTransaction?.staffId.firstName} ${editToTransaction?.staffId.lastName}`}
                />
              </Grid>
              <Grid md={12} sm={12} xs={12}>
                <TextField
                  fullWidth
                  sx={{ mt: "12px " }}
                  placeholder="Transaction Type"
                  label="Transaction Type"
                  value={editToTransaction?.transactionType || ""}
                  name="transactionType"
                  onChange={handleEditInputChange}
                />
              </Grid>
              <Grid display="contents" mt={2}>

                <Grid md={6} sm={12} xs={12}>

                  <Box>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                          sx={{ width: "96%", mt: "4px" }}
                          label="Transaction Date"
                          value={moment(
                            editToTransaction?.transactionDate,
                            "YYYY-MM-DD"
                          )}
                          onChange={(newDate) =>
                            handleEditInputChange({
                              target: {
                                name: "transactionDate",
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
                <Grid md={6} sm={12} xs={12}>
                  <TextField
                    fullWidth
                    sx={{ mt: "12px" }}
                    placeholder="Amount"
                    label="Amount"
                    onChange={handleEditInputChange}
                    value={editToTransaction?.amount || ""}
                    name="amount"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ display: "flex" }}>
          <Button
            onClick={handleEditTransaction}
            sx={saveButton}
            variant="contained"
          >
            Save
          </Button>
          <Button
            sx={cancelButton}
            variant="outlined"
            onClick={() => {
              setEditTransaction(null);
              setEditTransaction(false);
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {/* end edit transaction data  */}
    </>
  );
};

export default Transaction;
