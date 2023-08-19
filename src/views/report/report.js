import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
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
import { useTheme } from "@mui/material/styles";
import SearchSection from "layout/MainLayout/Header/SearchSection";
import React from "react";
import { useState } from "react";
import { gridSpacing } from "store/constant";
import MainCard from "ui-component/cards/MainCard";
import PrintIcon from "@mui/icons-material/Print";

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
  const [months, setMonths] = useState();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleButtonClick = () => {
    setDialogOpen(true);
  };
  return (
    <>
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
          <Grid md={6}>
            <SearchSection />
          </Grid>
          <Grid md={6}>
            <FormControl
              sx={{
                width: "400px",
                "@media (max-width: 1200px)": {
                  marginX: "20px",
                  width: "230px",
                },
              }}
            >
              <InputLabel id="demo-simple-select-label">Months</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={months}
                label="Months"
                onChange={(ele) => setMonths(ele.target.value)}
              >
                <MenuItem value={10}>January</MenuItem>
                <MenuItem value={20}>February</MenuItem>
                <MenuItem value={30}>March</MenuItem>
                <MenuItem value={40}>April</MenuItem>
                <MenuItem value={50}>May</MenuItem>
                <MenuItem value={60}>June</MenuItem>
                <MenuItem value={80}>July</MenuItem>
                <MenuItem value={90}>August</MenuItem>
                <MenuItem value={100}>September</MenuItem>
                <MenuItem value={200}>October</MenuItem>
                <MenuItem value={300}>November</MenuItem>
                <MenuItem value={400}>December</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid md={4} mt={2}>
            <Button variant="contained" onClick={handleButtonClick}>
              Contained
            </Button>
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
                  </TableRow>
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
          <Box>
            <Typography sx={detailsReport}>No.</Typography>
            <Typography sx={detailsReport}>Name</Typography>
            <Typography sx={detailsReport}>Date Of Start Work</Typography>
            <Typography sx={detailsReport}>End Of Work</Typography>
          </Box>
          <Divider sx={{ height: 1, bgcolor: "black", m: "20px" }} />
          <Grid container spacing={4} pt={2}>
            <Grid item md={3}>
              <Typography sx={{ fontWeight: 500, fontSize: "18px" }}>
                Leave Details
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Typography sx={detailsReport}>Date</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={detailsReport}>Days</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Typography sx={detailsReport}>Total Leave</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>0</Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item md={9}>
              <Typography sx={{ fontWeight: 500, fontSize: "18px" }}>
                Transaction Details
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Typography sx={detailsReport}>
                          Date of Update
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={detailsReport}>Total Update</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={detailsReport}>
                          Monthly Salary
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Typography>2023-08-01</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>2</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>$3000</Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
          <Divider sx={{ height: 1, bgcolor: "black", m: "20px" }} />
          <Box pt={2} display="flex">
            <Box>
              <Typography sx={detailsReport}>Days Worked</Typography>
              <Typography sx={detailsReport}>Holidays</Typography>
              <Typography sx={detailsReport}>Net Days Worked</Typography>
              <Typography sx={detailsReport}>Holidays</Typography>
              <Typography sx={detailsReport}>Work</Typography>
              <Typography sx={detailsReport}>Transaction</Typography>
              <Typography sx={detailsReport}>Balance</Typography>
            </Box>
            <Box ml={2}>
              <Typography sx={detailsReport}>30</Typography>
              <Typography sx={detailsReport}>0</Typography>
              <Typography sx={detailsReport}>30</Typography>
              <Typography sx={detailsReport}>8767</Typography>
              <Typography sx={detailsReport}>7500</Typography>
              <Typography sx={detailsReport}>7200</Typography>
              <Typography sx={detailsReport}>9067</Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{ pr: 2, pb: 2, display: "flex", alignItems: "center" }}
        >
          <Button sx={printDialog} variant="contained" color="primary">
            <PrintIcon sx={{ fontSize: "18px" }} />
            <Typography sx={{ ml: 1, color: "white", fontSize: "16px" }}>
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
    </>
  );
}

export default Report;
