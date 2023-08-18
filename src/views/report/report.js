import {
  Autocomplete,
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Table,
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

function Report(props) {
  const [months, setMonths] = useState();
  return (
    <div>
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
    </div>
  );
}

export default Report;
