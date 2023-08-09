import React, { useState } from "react";
import axios from "axios";
import moment from "moment";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
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

const Transaction = () => {
  const [open, setOpen] = useState(null);
  const [transaction, setTransaction] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = (event) => {
    setOpen(null);
  };

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
  console.log(transactionsData);

  const handleDatePicker = (ele) => {
    const currentDate = new Date(ele);
    const dateString = currentDate.toLocaleDateString("en-US");
    const formattedDate = moment(dateString).format("DD-MMM-YYYY");
    setTransactionsData((prevState) => ({
      ...prevState,
      transactionDate: formattedDate,
    }));
  };

  const handleSaveData = (event) => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `"${baseUrl.url}/api/transaction"`,
      headers: {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN0YWZmIiwiaWF0IjoxNjkxNTY2MDMzLCJleHAiOjE2OTE2NTI0MzN9.lPsrwxWAjsSKEfeYfJvDIItNY2kLuI8J13Jy-QgeEXc",
        "Content-Type": "application/json",
      },
      data: transactionsData,
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

  const [transactionList, setTransactionList] = useState([]);
  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl.url}/api/transaction/list`,
      headers: {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN0YWZmIiwiaWF0IjoxNjkxNTY2MDMzLCJleHAiOjE2OTE2NTI0MzN9.lPsrwxWAjsSKEfeYfJvDIItNY2kLuI8J13Jy-QgeEXc",
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log("response", response.data);
        setTransactionList(response.data.data);
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
          <SearchSection />
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} sm={12} sx={displayStyle}>
              <TableContainer sx={{ minWidth: "100%", borderRadius: "10px" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Employee ID</TableCell>
                      <TableCell align="center">Transaction Type</TableCell>
                      <TableCell align="center">Transaction Date</TableCell>
                      <TableCell align="center">Amount</TableCell>
                      <TableCell align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactionList.map((item) => {
                      return (
                        <>
                          <TableRow>
                            <TableCell align="center">{item.staffId}</TableCell>
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
      {/* start Transaction dialog */}

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
                <TextField
                  sx={{ width: "100%" }}
                  placeholder="Staff Id"
                  label="Staff ID"
                  onChange={handleChangeValue}
                  name="staffId"
                />
              </Grid>
              <Grid md={12}>
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
                <Grid md={6}>
                  <TextField
                    sx={{ mt: "12px", width: "96%" }}
                    placeholder="Transaction Type"
                    label="Transaction Type"
                    onChange={handleChangeValue}
                    name="transactionType"
                  />
                </Grid>
                <Grid md={6}>
                  <TextField
                    sx={{ mt: "12px", width: "100%" }}
                    placeholder="Amount"
                    label="Amount"
                    onChange={handleChangeValue}
                    name="amount"
                  />
                </Grid>
              </Grid>
              <Grid md={12} mt="12px">
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
          <Button sx={saveButton} variant="contained" onClick={handleSaveData}>
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

      {/* End Transaction dialog */}
    </>
  );
};

export default Transaction;
