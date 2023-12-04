import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import moment from "moment/moment";
import SearchSection from "layout/MainLayout/Header/SearchSection";
import React, { useEffect } from "react";
import { useState } from "react";
import { gridSpacing } from "store/constant";
import MainCard from "ui-component/cards/MainCard";
import axios from "axios";
import PrintProvider, { Print, NoPrint } from "react-easy-print";
import baseUrl from "../baseUrl";
import PrintIcon from "@mui/icons-material/Print";
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
const token = localStorage.getItem("token");

// css
const displayStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const printButton = {
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

const detailsReport = {
  fontWeight: 500,
  fontSize: "14px",
  border: "none",
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

const months = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
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

function Report(props) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStaffDataList, setFilteredStaffDataList] = useState([]);
  const [reportList, setReportList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reportData, setReportData] = useState([]);

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isLoadingStaffData, setIsLoadingStaffData] = useState(false);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleReportList = () => {
    const fDate = moment(selectedDate.format("YYYY-MM-DD"));

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${
        baseUrl.url
      }/api/report/staffWise?staffId=&date=${fDate.date()}-${fDate
        .month()+1}-${fDate.year()}`,
      headers: {
        token: token,
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setReportList(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    handleReportList();
  }, [selectedDate, reportList.staffId]);

  useEffect(() => {
    const debouncedSearch = setTimeout(() => {
      if (searchQuery === "") {
        setFilteredStaffDataList(reportList);
      } else {
        handleSearch();
      }
    }, 300);
    return () => clearTimeout(debouncedSearch);
  }, [searchQuery, reportList]);

  let rowCount = 0;

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    const filteredList = reportList.filter((item) =>
      item.staffName.toLowerCase().includes(query)
    );
    setFilteredStaffDataList(filteredList);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleButtonClick = (staffId) => {
    const fDate = moment(selectedDate.format("YYYY-MM-DD"));

    setDialogOpen(true);
    setIsLoadingStaffData(true);
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${
        baseUrl.url
      }/api/salarySlip?staffId=${staffId}&date=${fDate.date()}-${fDate
        .add(1, "month")
        .month()}-${fDate.year()}`,
      headers: {
        token: token,
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        setReportData(response.data);
        setIsLoadingStaffData(false);
      })
      .catch((error) => {
        setIsLoadingStaffData(false);
        if (error.response.data === "Invalid Token") {
          localStorage.clear();
          navigate = "/";
        }
      });
  };
  console.log("reportData", reportData.leaveTransactions);

  const positiveAmountStyle = {
    backgroundColor: "#BCE29E",
    color: "black",
  };

  const negativeAmountStyle = {
    backgroundColor: "#FF8787",
    color: "black",
  };

  return (
    <PrintProvider>
      <NoPrint>
        <MainCard>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} sm={12} sx={displayStyle}>
              <Box>
                <Typography variant="h3" gutterBottom>
                  Reports
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ height: 2, bgcolor: "black", marginY: "20px" }} />

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid container alignItems="center">
              <Grid md={4} sm={12} xs={12}>
                <SearchSection
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              </Grid>

              <Grid md={4} sm={12} xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      format="DD/MM/YYYY"
                      sx={{ width: "100%", mt: "4px" }}
                      label="Select Date"
                      value={selectedDate}
                      onChange={handleDateChange}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Box>
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
                        <TableCell align="center">No</TableCell>
                        <TableCell sx={{ fontSize: "16px" }} align="center">
                          Staff Name
                        </TableCell>
                        <TableCell sx={{ fontSize: "16px" }} align="center">
                          Salary
                        </TableCell>
                        <TableCell sx={{ fontSize: "16px" }} align="center">
                          Transaction
                        </TableCell>
                        <TableCell sx={{ fontSize: "16px" }} align="center">
                          leaves
                        </TableCell>
                        <TableCell sx={{ fontSize: "16px" }} align="center">
                          Final Amount
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredStaffDataList.map((item) => {
                        rowCount++;
                        const finalAmountStyle =
                          item.outstanding < 0
                            ? negativeAmountStyle
                            : positiveAmountStyle;
                        return (
                          <TableRow
                            key={item.staffId}
                            onClick={() => handleButtonClick(item.staffId)}
                            style={{ cursor: "pointer" }}
                          >
                            <TableCell align="center" style={finalAmountStyle}>
                              {rowCount}
                            </TableCell>
                            <TableCell align="center" style={finalAmountStyle}>
                              {item.fullName}
                            </TableCell>
                            <TableCell align="center" style={finalAmountStyle}>
                              {item.salary === "null" ? 0 : item.salary}
                            </TableCell>
                            <TableCell align="center" style={finalAmountStyle}>
                              {item.transactionTotal}
                            </TableCell>
                            <TableCell align="center" style={finalAmountStyle}>
                              {item.leaveTotal}
                            </TableCell>
                            <TableCell align="center" style={finalAmountStyle}>
                              {item.outstanding}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </TableContainer>
            </Grid>
          </Grid>
        </MainCard>
        {/* Salary Slip */}
        <Dialog
          maxWidth="md"
          fullWidth={true}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        >
          <DialogTitle fontSize="18px">Salary Slip</DialogTitle>
          <DialogContent>
            {isLoadingStaffData ? (
              <Oval
                height={50}
                width={50}
                color="#673ab7"
                wrapperStyle={{
                  position: "absolute",
                  top: "30%",
                  left: "46%",
                }}
                wrapperClass=""
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#673ab7"
                strokeWidth={2}
                strokeWidthSecondary={2}
              />
            ) : reportData.salary === "null" ? (
              <Typography
                display="flex"
                justifyContent="space-around"
                fontSize="20px"
                pt="12px"
              >
                No salary data found. Please add Salary
              </Typography>
            ) : (
              <Print single name="foo">
                <Box>
                  <Box display="flex" alignItems="center">
                    <Typography sx={detailsReport}>Name :</Typography>
                    <Typography ml={1}>{reportData.fullName}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Typography sx={detailsReport}>Phone No. :</Typography>
                    <Typography ml={1}>{reportData.phone}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Typography sx={detailsReport}>
                      Date Of Start Work :&nbsp;
                    </Typography>
                    <Typography>
                      {moment(reportData.dateOfStartWork).format("DD-MM-YYYY")}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Typography sx={detailsReport}>
                      Date Of End Work :&nbsp;
                    </Typography>
                    <Typography>
                      {moment(reportData.dateOfEndWork).format("DD-MM-YYYY")}
                    </Typography>
                  </Box>
                  <Divider sx={{ height: 1, bgcolor: "black", m: "20px" }} />
                  <Grid
                    container
                    spacing={4}
                    justifyContent="space-around"
                    pt={2}
                  >
                    <Grid item md={3}>
                      <Typography sx={{ fontWeight: 500, fontSize: "16px" }}>
                        Leave Details
                      </Typography>
                      <TableContainer component={Paper}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Date</TableCell>
                              <TableCell>Days</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {reportData.leaveTransactions &&
                              reportData.leaveTransactions.map((leave) => (
                                <TableRow key={leave.startDate}>
                                  <TableCell>
                                    {moment(leave.startDate).format(
                                      "DD-MM-YYYY"
                                    )}
                                  </TableCell>
                                  <TableCell>{leave.days}</TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                    <Grid item md={4}>
                      <Typography sx={{ fontWeight: 500, fontSize: "16px" }}>
                        Salary Details
                      </Typography>
                      <TableContainer component={Paper}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Salary Date</TableCell>
                              <TableCell>Salary Amount</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {reportData.salaryTransactions &&
                              reportData.salaryTransactions.map(
                                (salaryTransaction) => (
                                  <TableRow key={salaryTransaction.startDate}>
                                    <TableCell>
                                      {moment(salaryTransaction.date).format(
                                        "DD-MM-YYYY"
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {salaryTransaction.salary}
                                    </TableCell>
                                  </TableRow>
                                )
                              )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </Grid>
                  <Divider sx={{ height: 1, bgcolor: "black", m: "20px" }} />
                  <Grid container justifyContent="end">
                    <Grid md={4}>
                      <TableContainer component={Paper}>
                        <Table size="small">
                          <TableBody>
                            <TableRow>
                              <TableCell sx={detailsReport}>
                                Days Worked
                              </TableCell>
                              <TableCell>{reportData.totalDays}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={detailsReport}>Leave</TableCell>
                              <TableCell>{reportData.leaveTotal}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={detailsReport}>
                                Net Days Worked
                              </TableCell>
                              <TableCell>{reportData.NetDaysWorked}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={detailsReport}>Salary</TableCell>
                              <TableCell>{reportData.salary}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={detailsReport}>
                                Total Transaction Amount
                              </TableCell>
                              <TableCell>
                                {reportData.transactionTotal}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={detailsReport}>
                                Outstanding
                              </TableCell>
                              <TableCell>{reportData.outstanding}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </Grid>
                  <Box>
                    <TableRow>
                      <TableCell sx={detailsReport}>Final Amount :</TableCell>
                      <TableCell sx={{ border: "none" }}>
                        {reportData.outstanding}
                      </TableCell>
                    </TableRow>
                  </Box>
                  <Divider sx={{ height: 1, bgcolor: "black", mb: "20px" }} />
                  <Grid item md={6}>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: "16px",
                        textAlign: "center",
                      }}
                    >
                      Transaction Details
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell align="center">
                              Transaction Date
                            </TableCell>
                            <TableCell align="center">
                              Transaction Note
                            </TableCell>
                            <TableCell align="center">Amount</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {reportData.transactions &&
                            reportData.transactions.map((transactions) => (
                              <TableRow key={transactions.transactionDate}>
                                <TableCell align="center">
                                  {moment(transactions.transactionDate).format(
                                    "DD-MM-YYYY"
                                  )}
                                </TableCell>
                                <TableCell align="center">
                                  {transactions.description
                                    ? transactions.description
                                    : "N/A"}
                                </TableCell>
                                <TableCell align="center">
                                  {transactions.amount}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Box>
              </Print>
            )}
          </DialogContent>
          <DialogActions
            sx={{ pr: 2, pb: 2, display: "flex", alignItems: "center" }}
          >
            <Button variant="contained" color="primary" sx={printButton}>
              <PrintIcon sx={{ fontSize: "18px" }} />
              <Typography
                onClick={handlePrint}
                sx={{ ml: 1, color: "white", fontSize: "16px" }}
              >
                Print
              </Typography>
            </Button>
            <Button
              sx={cancelButton}
              variant="outlined"
              onClick={() => setDialogOpen(false)}
              autoFocus
            >
              CANCEL
            </Button>
          </DialogActions>
        </Dialog>
      </NoPrint>
    </PrintProvider>
  );
}

export default Report;
