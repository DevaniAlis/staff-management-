import {
  Autocomplete,
  Box,
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
  OutlinedInput,
  Paper,
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
import SearchSection from "layout/MainLayout/Header/SearchSection";
import React, { useEffect } from "react";
import { useState } from "react";
import { gridSpacing } from "store/constant";
import MainCard from "ui-component/cards/MainCard";
import axios from "axios";

import PrintProvider, { Print, NoPrint } from "react-easy-print";

import baseUrl from "../baseUrl";
import PrintIcon from "@mui/icons-material/Print";

const token = localStorage.getItem("token");
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// css
const displayStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const printDialog = {
  padding: "8px 15px",
};

const detailsReport = {
  fontWeight: 500,
  fontSize: "16px",
};

const CancelDialog = {
  padding: "5px 15px",
  border: "1px solid #1E88E5",
  color: "#1E88E5",
  textTransform: "none",
};

const dummyReportData = {
  No: "1",
  staffName: "John Doe",
  dateOfStartWork: "2023-01-01",
  endOfWork: "2023-08-31",
  leaveDetails: [
    { date: "2023-08-01", days: 0 },
    { date: "2023-08-01", days: 1 },
    { date: "2023-08-01", days: 2 },
    { date: "2023-08-01", days: 3 },
  ],
  transactionDetails: [
    { date: "2023-08-01", totalUpdate: 2, monthlySalary: "3000" },
    { date: "2023-08-01", totalUpdate: 3, monthlySalary: "3000" },
    { date: "2023-08-01", totalUpdate: 4, monthlySalary: "3000" },
    { date: "2023-08-01", totalUpdate: 5, monthlySalary: "3000" },
  ],
  daysWorked: 30,
  holidays: 0,
  netDaysWorked: 30,
  holidays2: 8767,
  work: 7500,
  transaction: 7200,
  balance: 9067,
};

function Report(props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStaffDataList, setFilteredStaffDataList] = useState([]);
  const [salarySlip , setSalarySlip] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Set default current month
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Set default current year
  const [reportList, setReportList] = useState([]);

  useEffect(() => {
    const currentMonth = new Date().getMonth();
    setSelectedMonth(currentMonth);
    setSelectedYear(new Date().getFullYear());
    handleReportList(currentMonth);
    if (searchQuery === "") {
      setFilteredStaffDataList(reportList);
    } else {
      handleSearch();
    }
  }, [searchQuery, reportList]);

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();

    const filteredList = reportList.filter((item) => {
      if (item.staffName === query) {
        return item;
      }
      return false;
    });
    console.log(filteredList);
    setFilteredStaffDataList(filteredList);
  };

  const handleReportList = (value) => {
    console.log(value);
    setSelectedMonth(value);
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl.url}/api/report/staffWise?month=${value + 1}`,
      headers: {
        token: token,
      },
    };
    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        setReportList(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const salary = () =>{

  }

  const handlePrint = () => {
    window.print();
  };

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleButtonClick = () => {
    setDialogOpen(true);
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

          <Grid container>
            <Grid md={3} sm={12} xs={12} marginRight={"20px"}>
              <SearchSection
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </Grid>
            <Grid
              md={3}
              sm={12}
              xs={12}
              sx={{
                marginLeft: "150px",
                "@media (max-width: 1200px)": {
                  marginX: "20px",
                },
              }}
            >
              <FormControl
                fullWidth
                sx={{
                  "@media (max-width: 1200px)": {
                    marginX: "20px",
                    marginTop: "14px",
                  },
                }}
              >
                <InputLabel id="demo-simple-select-label">Months</InputLabel>
                <Select
                  fullWidth
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedMonth}
                  label="Months"
                  onChange={(e) => handleReportList(e.target.value)}
                >
                  {months.map((month, index) => (
                    <MenuItem key={index} value={index}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid
              md={3}
              sm={12}
              xs={12}
              sx={{
                marginLeft: "20px",
                "@media (max-width: 1200px)": {
                  marginX: "20px",
                },
              }}
            >
              <FormControl
                fullWidth
                sx={{
                  "@media (max-width: 1200px)": {
                    marginX: "20px",
                    marginTop: "14px",
                  },
                }}
              >
                <InputLabel id="demo-simple-select-label">Year</InputLabel>
                <Select
                  fullWidth
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedYear}
                  label="Months"
                  onChange={(e) => handleReportList(e.target.value)}
                >
                  <MenuItem value={2023}>2023</MenuItem>
                  <MenuItem value={2022}>2022</MenuItem>
                  <MenuItem value={2021}>2021</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} sm={12} sx={displayStyle}>
              <TableContainer sx={{ minWidth: "100%", borderRadius: "10px" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Staff Name</TableCell>
                      <TableCell align="center">Salary</TableCell>
                      <TableCell align="center">Transaction</TableCell>
                      <TableCell align="center">Actual Salary</TableCell>
                      <TableCell align="center">
                        <Button variant="contained" onClick={handleButtonClick}>
                          Contained
                        </Button>
                      </TableCell>
                    </TableRow>
                    {filteredStaffDataList.map((item) => {
                      return (
                        <TableRow>
                          <TableCell align="center">{item.staffName}</TableCell>
                          <TableCell align="center">{item.salary}</TableCell>
                          <TableCell align="center">
                            {item.transactionTotal}
                          </TableCell>
                          <TableCell align="center">
                            {item.actualSalary}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableHead>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </MainCard>
        <Dialog
          maxWidth="md"
          fullWidth={true}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        >
          <DialogTitle fontSize="18px">Salary Slip</DialogTitle>
          <DialogContent>
            <Print single name="foo">
              <Box>
                <Typography sx={detailsReport}>
                  No. : {dummyReportData.No}
                </Typography>
                <Typography sx={detailsReport}>
                  Name : {dummyReportData.staffName}
                </Typography>
                <Typography sx={detailsReport}>
                  Date Of Start Work : {dummyReportData.dateOfStartWork}
                </Typography>
                <Typography sx={detailsReport}>
                  End Of Work : {dummyReportData.endOfWork}
                </Typography>
              </Box>
              <Divider sx={{ height: 1, bgcolor: "black", m: "20px" }} />
              <Grid container spacing={4} pt={2}>
                <Grid item md={3}>
                  <Typography sx={{ fontWeight: 500, fontSize: "18px" }}>
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
                        {dummyReportData.leaveDetails.map((leave, index) => (
                          <TableRow key={index}>
                            <TableCell align="center">{leave.date}</TableCell>
                            <TableCell align="center">{leave.days}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item md={9}>
                  <Typography sx={{ fontWeight: 500, fontSize: "18px" }}>
                    Transaction Details
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Date of Update</TableCell>
                          <TableCell>Total Update</TableCell>
                          <TableCell>Monthly Salary</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dummyReportData.transactionDetails.map(
                          (transaction) => (
                            <TableRow key={transaction.date}>
                              <TableCell>{transaction.date}</TableCell>
                              <TableCell>{transaction.totalUpdate}</TableCell>
                              <TableCell>{transaction.monthlySalary}</TableCell>
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
                          <TableCell sx={detailsReport}>Days Worked</TableCell>
                          <TableCell>{dummyReportData.daysWorked}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={detailsReport}>Holidays</TableCell>
                          <TableCell>{dummyReportData.holidays}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={detailsReport}>
                            Net Days Worked
                          </TableCell>
                          <TableCell>{dummyReportData.netDaysWorked}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={detailsReport}>Holidays</TableCell>
                          <TableCell>{dummyReportData.holidays2}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={detailsReport}>Work</TableCell>
                          <TableCell>{dummyReportData.work}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={detailsReport}>Transaction</TableCell>
                          <TableCell>{dummyReportData.transaction}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={detailsReport}>Balance</TableCell>
                          <TableCell>{dummyReportData.balance}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
              <Box>
                <TableRow>
                  <TableCell sx={detailsReport}>Final Amount</TableCell>
                  <TableCell>{dummyReportData.balance}</TableCell>
                </TableRow>
              </Box>
            </Print>
          </DialogContent>
          <DialogActions
            sx={{ pr: 2, pb: 2, display: "flex", alignItems: "center" }}
          >
            <Button sx={printDialog} variant="contained" color="primary">
              <PrintIcon sx={{ fontSize: "18px" }} />
              <Typography
                onClick={handlePrint}
                sx={{ ml: 1, color: "white", fontSize: "16px" }}
              >
                Print
              </Typography>
            </Button>
            <Button
              variant="outlined"
              style={CancelDialog}
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
