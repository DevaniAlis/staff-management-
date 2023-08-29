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
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [isLoadingStaffData, setIsLoadingStaffData] = useState(false);

  const handleReportList = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl.url}/api/report/staffWise?month=${selectedMonth}&year=${selectedYear}`,
      headers: {
        token: token,
      },
    };
    axios
      .request(config)
      .then((response) => {
        setReportList(response.data.data);
        setIsLoading(false);
      })
  };

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
    setFilteredStaffDataList(filteredList);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleButtonClick = (staffId) => {
    setDialogOpen(true);
    setIsLoadingStaffData(true);
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl.url}/api/salarySlip?staffId=${staffId}&month=${selectedMonth}&year=${selectedYear}`,
      headers: {
        token: token,
      },
    };

    axios
      .request(config)
      .then((response) => {
        setReportData(response.data.data);
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
                <style>
                  {`
                      .MuiAutocomplete-listbox li:hover
                      {
                        color: #5e35b1;
                      },
                  `}
                </style>
                <Autocomplete
                  sx={autoPikerStyle}
                  clearIcon={null}
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
                  renderInput={(params) => (
                    <TextField {...params} label="Year" />
                  )}
                />
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
                        <TableCell align="center">Staff Name</TableCell>
                        <TableCell align="center">Salary</TableCell>
                        <TableCell align="center">Transaction</TableCell>
                        <TableCell align="center">Actual Salary</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredStaffDataList.map((item) => {
                        return (
                          <TableRow
                            key={item.staffId}
                            onClick={() => handleButtonClick(item.staffId)}
                            style={{ cursor: "pointer" }}
                          >
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
            ) : (
              <Print single name="foo">
                {reportData.map((item) => {
                  return (
                    <>
                      <Box key={item.staffId}>
                        <Box display="flex" alignItems="center">
                          <Typography sx={detailsReport}>Name :</Typography>
                          <Typography ml={1}>{item.staffName}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center">
                          <Typography sx={detailsReport}>
                            Date Of Start Work :
                          </Typography>
                          <Typography>
                            {moment(item.dateOfStartWork).format("DD-MM-YYYY")}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center">
                          <Typography sx={detailsReport}>
                            End Of Work :
                          </Typography>
                          <Typography>
                            {moment(item.dateOfEndWork).format("DD-MM-YYYY")}
                          </Typography>
                        </Box>
                        <Divider
                          sx={{ height: 1, bgcolor: "black", m: "20px" }}
                        />
                        <Grid container spacing={4} pt={2}>
                          <Grid item md={3}>
                            <Typography
                              sx={{ fontWeight: 500, fontSize: "16px" }}
                            >
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
                                  {item.leaveData.leaves.map((leave) => (
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
                          <Grid item md={9}>
                            <Typography
                              sx={{ fontWeight: 500, fontSize: "16px" }}
                            >
                              Transaction Details
                            </Typography>
                            <TableContainer component={Paper}>
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Transaction Date</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Monthly Salary</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {item.transactionData.transactions.map(
                                    (transactions) => (
                                      <TableRow
                                        key={transactions.transactionDate}
                                      >
                                        <TableCell>
                                          {moment(
                                            transactions.transactionDate
                                          ).format("DD-MM-YYYY")}
                                        </TableCell>
                                        <TableCell>
                                          {transactions.amount}
                                        </TableCell>
                                        <TableCell>
                                          {item.transactionData.total}
                                        </TableCell>
                                      </TableRow>
                                    )
                                  )}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Grid>
                        </Grid>
                        <Divider
                          sx={{ height: 1, bgcolor: "black", m: "20px" }}
                        />
                        <Grid container justifyContent="end">
                          <Grid md={4}>
                            <TableContainer component={Paper}>
                              <Table size="small">
                                <TableBody>
                                  <TableRow>
                                    <TableCell sx={detailsReport}>
                                      Days Worked
                                    </TableCell>
                                    <TableCell>30</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell sx={detailsReport}>
                                      Leave
                                    </TableCell>
                                    <TableCell>
                                      {item.leaveData.total}
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell sx={detailsReport}>
                                      Net Days Worked
                                    </TableCell>
                                    <TableCell>{item.netDaysWorked}</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell sx={detailsReport}>
                                      Pending Amount
                                    </TableCell>
                                    <TableCell>0</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell sx={detailsReport}>
                                      Salary
                                    </TableCell>
                                    <TableCell>{item.salary}</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell sx={detailsReport}>
                                      Total Transaction Amount
                                    </TableCell>
                                    <TableCell>
                                      {item.transactionData.total}
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell sx={detailsReport}>
                                      Balance
                                    </TableCell>
                                    <TableCell>{item.actualSalary}</TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Grid>
                        </Grid>
                        <Box>
                          <TableRow>
                            <TableCell sx={detailsReport}>
                              Final Amount :
                            </TableCell>
                            <TableCell>{item.actualSalary}</TableCell>
                          </TableRow>
                        </Box>
                      </Box>
                    </>
                  );
                })}
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
