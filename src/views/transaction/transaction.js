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
import { Box } from "@mui/system";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Oval } from "react-loader-spinner";
import { makeStyles } from "@mui/styles";
import baseUrl from "../baseUrl";
import { useNavigate } from "react-router";

// ==============================|| Employee ||============================== //

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

const hoverEffect = {
  "&:hover": {
    backgroundColor: "transparent",
  },
  padding: "0px",
  minWidth: "35px",
};

const editDialog = {
  color: "#5e35b1",
  borderColor: "#5e35b1",
};

const deleteDialog = {
  backgroundColor: "#5e35b1",
  padding: "5px 20px",
  "&:hover": {
    border: "1px solid #5e35b1",
    backgroundColor: "#5e35b1",
  },
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

const autoPikerStyle = {
  width: "96%",
  marginX: "20px",
  "@media (max-width: 900px)": {
    marginX: "20px",
    marginY: "6px",
    width: "100%",
  },
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

const Transaction = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(false);
  const [transactionOpen, setTransactionOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [editTransaction, setEditTransaction] = useState(false);
  const [editToTransaction, setEditToTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(true);
  const [staffList, setStaffList] = useState([]);
  const [validateError, setValidateError] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStaffDataList, setFilteredStaffDataList] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
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
    setTransactionsData((prevData) => ({
      ...prevData,
      staffId: newValue ? newValue._id : "",
    }));
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
        if (error.response.data === "Invalid Token") {
          localStorage.clear();
          navigate = "/";
        } else {
          console.error("Error:", error);
        }
      });
  }, []);

  const [transactionList, setTransactionList] = useState([]);
  const getTransactionList = () => {
    setTableLoading(true);
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl.url}/api/transaction/list?staffId=${transactionsData.staffId}&month=${selectedMonth}&year=${selectedYear}`,
      headers: {
        token: token,
        "Content-Type": "application/json",
      },
    };
    axios
      .request(config)
      .then((response) => {
        setTransactionList(response.data.data);
        setTableLoading(false);
      })
      .catch((error) => {
        console.log(error.response.data);
        setTableLoading(false);
      });
  };

  useEffect(() => {
    getTransactionList();
  }, [selectedMonth, selectedYear, transactionsData.staffId]);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredStaffDataList(transactionList);
    } else {
      handleSearch();
    }
  }, [searchQuery, transactionList]);

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    const filteredList = transactionList.filter((item) => {
      const firstName = item.staffId.firstName.toLowerCase();
      if (firstName === query) {
        return (
          (selectedMonth === "" || item.month === selectedMonth) &&
          (selectedYear === "" || item.year === selectedYear)
        );
      }
      return false;
    });
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
      axios.request(config).then((response) => {
        window.location.reload();
        setTransaction(false);
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

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const startYear = 2020;
  const currentYear = new Date().getFullYear();
  const years = [];

  for (let i = currentYear; i >= startYear; i--) {
    years.push({ value: i, label: `${i}` });
  }

  return (
    <>
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
                className={classes.customButton}
              >
                Add Transaction
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ height: 2, bgcolor: "black", marginY: "20px" }} />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Grid container>
            <Grid md={4} sm={12} xs={12}>
              <style>
                {`
                      .MuiAutocomplete-listbox li:hover
                      {
                        color: #5e35b1;
                      },
                  `}
              </style>
              <Autocomplete
                disablePortal
                clearIcon={null}
                options={staffList}
                getOptionLabel={(staff) =>
                  `${staff.firstName} ${staff.lastName}`
                }
                getOptionSelected={(option, value) => option._id === value._id}
                value={
                  staffList.find(
                    (staff) => staff._id === transactionsData.staffId
                  ) || null
                }
                onChange={(event, newValue) => {
                  setTransactionsData((prevData) => ({
                    ...prevData,
                    staffId: newValue ? newValue._id : "",
                  }));
                  setSelectedMonth("");
                  setSelectedYear("");
                }}
                sx={autoPikerStyle}
                renderInput={(params) => (
                  <TextField {...params} label="Staff Name" name="staffId" />
                )}
              />
            </Grid>
            <Grid md={4} sm={12} xs={12}>
              <Autocomplete
                clearIcon={null}
                sx={autoPikerStyle}
                disablePortal
                options={months}
                getOptionLabel={(month) => month.label}
                value={months.find((month) => month.value === selectedMonth)}
                onChange={(event, newValue) =>
                  setSelectedMonth(newValue?.value || "")
                }
                renderInput={(params) => (
                  <TextField {...params} label="Month" />
                )}
              />
            </Grid>
            <Grid md={4} sm={12} xs={12}>
              <Autocomplete
                sx={autoPikerStyle}
                clearIcon={null}
                disablePortal
                options={years}
                getOptionLabel={(year) => year.label}
                value={years.find((year) => year.value === selectedYear)}
                onChange={(event, newValue) =>
                  setSelectedYear(newValue?.value || "")
                }
                renderInput={(params) => <TextField {...params} label="Year" />}
              />
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={12} sx={displayStyle}>
            <TableContainer sx={{ minWidth: "100%", borderRadius: "10px" }}>
              {tableLoading ? (
                <Oval
                  height={50}
                  width={50}
                  color="#673ab7"
                  wrapperStyle={{
                    position: "absolute",
                    top: "52%",
                    left: "55%",
                    transform: "translate(-50%, -50%)",
                  }}
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
                      <TableCell sx={{ fontSize: "16px" }} align="center">
                        Staff Name
                      </TableCell>
                      <TableCell sx={{ fontSize: "16px" }} align="center">
                        Transaction Type
                      </TableCell>
                      <TableCell sx={{ fontSize: "16px" }} align="center">
                        Transaction Date
                      </TableCell>
                      <TableCell sx={{ fontSize: "16px" }} align="center">
                        Amount
                      </TableCell>
                      <TableCell sx={{ fontSize: "16px" }} align="center">
                        Action
                      </TableCell>
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
                              {moment(item.transactionDate).format(
                                "DD-MM-YYYY"
                              )}
                            </TableCell>
                            <TableCell align="center">{item.amount}</TableCell>
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
              )}
            </TableContainer>
          </Grid>
        </Grid>
      </MainCard>

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
              <Grid md={12} sm={12} xs={12}>
                <Autocomplete
                  fullWidth
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
                  renderInput={(params) => (
                    <TextField {...params} label="Staff Name" name="staffId" />
                  )}
                />
              </Grid>

              <Grid md={12} sm={12} xs={12} mt="3px">
                <Box>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        format="DD/MM/YYYY"
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
                  <Box
                    sx={{
                      mt: "12px",
                      width: "96%",
                      "@media (max-width: 900px)": {
                        width: "100%",
                      },
                    }}
                  >
                    <FormControl fullWidth>
                      <InputLabel>Transaction Type</InputLabel>
                      <Select
                        label="Transaction Type"
                        name="transactionType"
                        onChange={handleChangeValue}
                      >
                        <MenuItem name="transactionType" value="case">
                          cash
                        </MenuItem>
                        <MenuItem name="transactionType" value="online">
                          online 
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  {/* <TextField
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
                  /> */}
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
                  sx={{ pointerEvents: "none", cursor: "default" }}
                  onChange={handleChangeValue}
                  value={`${editToTransaction?.staffId.firstName} ${editToTransaction?.staffId.lastName}`}
                />
              </Grid>
              <Grid md={12} sm={12} xs={12} mt="3px">
                <Box>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        sx={{ width: "100%", mt: "4px" }}
                        label="Transaction Date"
                        value={dayjs(
                          moment(editToTransaction?.transactionDate).format(
                            "YYYY-MM-DD"
                          )
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
                        format="DD-MM-YYYY"
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Box>
              </Grid>
              <Grid display="contents" mt={2}>
                <Grid md={6} sm={12} xs={12}>
                  <Box sx={{ width: "96%", mt: "12px" }}>
                    <FormControl fullWidth>
                      <InputLabel>Transaction Type</InputLabel>
                      <Select
                        label="Transaction Type"
                        name="transactionType"
                        value={
                          editToTransaction
                            ? editToTransaction.transactionType
                            : ""
                        }
                        onChange={handleEditInputChange}
                      >
                        <MenuItem value="case">cash</MenuItem>
                        <MenuItem value="online">online</MenuItem>
                      </Select>
                    </FormControl>
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
                <Grid md={12} sm={12} xs={12} mt="12px">
                  <TextField
                    sx={{ width: "100%" }}
                    placeholder="Description"
                    label="Description"
                    onChange={handleEditInputChange}
                    value={editToTransaction?.description || ""}
                    name="description"
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
