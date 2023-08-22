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

const token = localStorage.getItem("token");

// css
const displayStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
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

const currentYear = new Date().getFullYear();
const years = [
  { value: currentYear - 2, label: `${currentYear - 2}` },
  { value: currentYear - 1, label: `${currentYear - 1}` },
  { value: currentYear, label: `${currentYear}` },
];

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
  const [reportList, setReportList] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [staffId, setStaffId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const handleReportList = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl.url}/api/report/staffWise?month=${selectedMonth}&year=${selectedYear}&staffId=${staffId}`,
      headers: {
        token: token,
      },
    };
    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        setReportList(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const salary = () => {};

  useEffect(() => {
    handleReportList();
  }, [selectedMonth, selectedYear, reportList.staffId]);

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

  useEffect(() => {
    setIsLoading(true);
  }, [selectedMonth, selectedYear]);

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    const filteredList = reportList.filter((item) =>
      item.staffName.toLowerCase().includes(query)
    );
    console.log("filteredList: ", filteredList);
    setFilteredStaffDataList(filteredList);
  };

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleMonthChange = (newValue) => {
    const selectedMonthValue = newValue ? parseInt(newValue.value) : null;

    // Update the selected month state
    setSelectedMonth(selectedMonthValue);
  };

  const [dialogOpen, setDialogOpen] = useState(false);

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
                  marginLeft: "105px",
                },
                "@media (max-width: 900px)": {
                  marginX: "20px",
                  marginY: "18px",
                },
              }}
            >
              <Autocomplete
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
            <Grid
              md={3}
              sm={12}
              xs={12}
              sx={{
                marginLeft: "20px",
                "@media (max-width: 1200px)": {
                  marginX: "20px",
                },
                "@media (max-width: 1166px)": {
                  marginX: "20px",
                  marginY: "10px",
                },
              }}
            >
              <Autocomplete
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
                        <TableCell align="center">Transaction</TableCell>
                        <TableCell align="center">Actual Salary</TableCell>
                        <TableCell align="center">
                          <Button variant="outlined" onClick={handleClickOpen}>
                            Open alert dialog
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredStaffDataList.map((item) => {
                        return (
                          <TableRow>
                            <TableCell align="center">
                              {item.staffName}
                            </TableCell>
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
                    </TableBody>
                  </Table>
                )}
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
                <Typography>No. : {dummyReportData.No}</Typography>
                <Typography>Name : {dummyReportData.staffName}</Typography>
                <Typography>
                  Date Of Start Work : {dummyReportData.dateOfStartWork}
                </Typography>
                <Typography>
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
                          <TableCell>Days Worked</TableCell>
                          <TableCell>{dummyReportData.daysWorked}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Holidays</TableCell>
                          <TableCell>{dummyReportData.holidays}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Net Days Worked</TableCell>
                          <TableCell>{dummyReportData.netDaysWorked}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Holidays</TableCell>
                          <TableCell>{dummyReportData.holidays2}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Work</TableCell>
                          <TableCell>{dummyReportData.work}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Transaction</TableCell>
                          <TableCell>{dummyReportData.transaction}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Balance</TableCell>
                          <TableCell>{dummyReportData.balance}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
              <Box>
                <TableRow>
                  <TableCell>Final Amount</TableCell>
                  <TableCell>{dummyReportData.balance}</TableCell>
                </TableRow>
              </Box>
            </Print>
          </DialogContent>
          <DialogActions
            sx={{ pr: 2, pb: 2, display: "flex", alignItems: "center" }}
          >
            <Button variant="contained" color="primary">
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
