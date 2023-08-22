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

function Report(props) {
  const [open, setOpen] = useState(false);
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
    setOpen(true);
  };
  const handleClickClose = () => {
    setOpen(false);
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
                "@media (max-width: 900px)": {
                  marginX: "20px",
                },
              }}
            >
              <Autocomplete
                disablePortal
                options={months}
                getOptionLabel={(month) => month.label}
                value={months.find((month) => month.value === selectedMonth)}
                onChange={(event, newValue) =>
                  // console.log(newValue)
                  // setSelectedMonth(newValue)
                  handleMonthChange(newValue)
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
          open={open}
          onClose={handleClickClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Use Google's location service?"}
          </DialogTitle>
          <DialogContent>
            <Print single name="foo">
              <DialogContentText id="alert-dialog-description">
                What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the
                printing and typesetting industry. Lorem Ipsum has been the
                industry's standard dummy text ever since the 1500s, when an
                unknown printer took a galley of type and scrambled it to make a
                type specimen book. It has survived not only five centuries,
              </DialogContentText>
            </Print>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClickClose}>Disagree</Button>
            <Button onClick={handlePrint} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </NoPrint>
    </PrintProvider>
  );
}

export default Report;
