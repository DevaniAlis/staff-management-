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

function Report(props) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStaffDataList, setFilteredStaffDataList] = useState([]);
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

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickClose = () => {
    setOpen(false);
  };
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
                        <Button variant="outlined" onClick={handleClickOpen}>
                          Open alert dialog
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
                type specimen book. It has survived not only five centuries, but
                also the leap into electronic typesetting, remaining essentially
                unchanged. It was popularised in the 1960s with the release of
                Letraset sheets containing Lorem Ipsum passages, and more
                recently with desktop publishing software like Aldus PageMaker
                including versions of Lorem Ipsum. What is Lorem Ipsum? Lorem
                Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum. What is Lorem Ipsum? Lorem Ipsum is simply dummy
                text of the printing and typesetting industry. Lorem Ipsum has
                been the industry's standard dummy text ever since the 1500s,
                when an unknown printer took a galley of type and scrambled it
                to make a type specimen book. It has survived not only five
                centuries, but also the leap into electronic typesetting,
                remaining essentially unchanged. It was popularised in the 1960s
                with the release of Letraset sheets containing Lorem Ipsum
                passages, and more recently with desktop publishing software
                like Aldus PageMaker including versions of Lorem Ipsum. What is
                Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing
                and typesetting industry. Lorem Ipsum has been the industry's
                standard dummy text ever since the 1500s, when an unknown
                printer took a galley of type and scrambled it to make a type
                specimen book. It has survived not only five centuries, but also
                the leap into electronic typesetting, remaining essentially
                unchanged. It was popularised in the 1960s with the release of
                Letraset sheets containing Lorem Ipsum passages, and more
                recently with desktop publishing software like Aldus PageMaker
                including versions of Lorem Ipsum. What is Lorem Ipsum? Lorem
                Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum. What is Lorem Ipsum? Lorem Ipsum is simply dummy
                text of the printing and typesetting industry. Lorem Ipsum has
                been the industry's standard dummy text ever since the 1500s,
                when an unknown printer took a galley of type and scrambled it
                to make a type specimen book. It has survived not only five
                centuries, but also the leap into electronic typesetting,
                remaining essentially unchanged. It was popularised in the 1960s
                with the release of Letraset sheets containing Lorem Ipsum
                passages, and more recently with desktop publishing software
                like Aldus PageMaker including versions of Lorem Ipsum. What is
                Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing
                and typesetting industry. Lorem Ipsum has been the industry's
                standard dummy text ever since the 1500s, when an unknown
                printer took a galley of type and scrambled it to make a type
                specimen book. It has survived not only five centuries, but also
                the leap into electronic typesetting, remaining essentially
                unchanged. It was popularised in the 1960s with the release of
                Letraset sheets containing Lorem Ipsum passages, and more
                recently with desktop publishing software like Aldus PageMaker
                including versions of Lorem Ipsum. What is Lorem Ipsum? Lorem
                Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
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
