import React, { useState } from "react";
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

function Salary(props) {
  const [open, setOpen] = useState(null);
  const [salaryopen, setSalaryOpen] = useState(false);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = (event) => {
    setOpen(null);
  };
  return (
    <>
      <MainCard>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={12} sx={displayStyle}>
            <Box>
              <Typography variant="h3" gutterBottom>
                Salary Details
              </Typography>
            </Box>
            <Box>
              <Button
                variant="contained"
                onClick={() => setSalaryOpen(true)}
                sx={addButtonStyle}
                startIcon={<IconCirclePlus />}
              >
                Add Salary
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
                    <TableCell align="center">Salary</TableCell>
                    <TableCell align="center">Salary Date</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableCell align="center">1</TableCell>
                  <TableCell align="center">15000</TableCell>
                  <TableCell align="center">15-02-2004</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="large"
                      color="inherit"
                      onClick={handleOpenMenu}
                    >
                      <IconDotsVertical icon={"eva:more-vertical-fill"} />
                    </IconButton>
                  </TableCell>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </MainCard>
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
      {/* start salary dialog */}
      <Dialog
         open={salaryopen}
         maxWidth="sm"
         fullWidth={true}
         onClose={() => setSalaryOpen(false)}
      >
        <DialogTitle>
          <Typography sx={{ fontSize: "20px" }}>Add Salary</Typography>
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
                />
              </Grid>
              <Grid display="contents" mt={2}>
                <Grid md={6}>
                  <Box>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                          sx={{ width: "96%", mt: "4px" }}
                          label="Salary Date"
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </Box>
                </Grid>
                <Grid md={6}>
                  <TextField
                    sx={{ mt: "12px", width: "100%" }}
                    placeholder="Salary"
                    label="Salary"
                  />
                </Grid>
              </Grid>
              <Grid md={12} mt="12px">
                <TextField
                  sx={{ width: "100%" }}
                  placeholder="Notes"
                  label="Notes"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ display: "flex" }}>
          <Button sx={saveButton} variant="contained">
            Save
          </Button>
          <Button
            sx={cancelButton}
            variant="outlined"
            onClick={() => setSalaryOpen(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {/* end salary dialog */}
    </>
  );
}

export default Salary;
