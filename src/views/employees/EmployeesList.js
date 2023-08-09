import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

// project imports
import MainCard from "ui-component/cards/MainCard";
import { Box } from "@mui/system";
import { useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// ==============================|| EmployeeList ||============================== //

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

const medicinesName = [{ label: "alis" }, { label: "yash" }, { label: "raj " }];

const EmployeeList = () => {
  const [open, setOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [salaryopen, setSalaryOpen] = useState(false);
  const [transaction, setTransaction] = useState(false);
  return (
    <>
      <MainCard>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography>Staff</Typography>
          <Box display="flex">
            <Button onClick={() => setOpen(true)} variant="contained">
              <Typography>Add Staff</Typography>
            </Button>
          </Box>
        </Box>
      </MainCard>

      <MainCard>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography>Leave </Typography>
          <Box display="flex">
            <Button onClick={() => setLeaveOpen(true)} variant="contained">
              <Typography>Add Leave </Typography>
            </Button>
          </Box>
        </Box>
      </MainCard>

      <MainCard>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography>Salary </Typography>
          <Box display="flex">
            <Button onClick={() => setSalaryOpen(true)} variant="contained">
              <Typography>Add Salary </Typography>
            </Button>
          </Box>
        </Box>
      </MainCard>

      <MainCard>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography>Transaction </Typography>
          <Box display="flex">
            <Button onClick={() => setTransaction(true)} variant="contained">
              <Typography>Add Transaction </Typography>
            </Button>
          </Box>
        </Box>
      </MainCard>

      {/* start add Employees Dialog */}
      <Dialog
        open={open}
        maxWidth="sm"
        fullWidth={true}
        onClose={() => setOpen(false)}
      >
        <DialogTitle>
          <Typography sx={{ fontSize: "20px" }}>Add Staff</Typography>
        </DialogTitle>
        <Divider sx={{ marginY: "2px", color: "black" }} />
        <DialogContent>
          <Box>
            <Grid container>
              <Grid container display="flex" justifyContent="space-between">
                <Grid item md={12}>
                  <TextField
                    sx={{ mt: "8px", width: "100%" }}
                    placeholder="First Name"
                    variant="outlined"
                    label="First Name"
                  />
                </Grid>
                <Grid item md={12}>
                  <TextField
                    sx={{ mt: "12px", width: "100%" }}
                    placeholder="Middle Name"
                    variant="outlined"
                    label="Middle Name"
                  />
                </Grid>
                <Grid item md={12}>
                  <TextField
                    sx={{ mt: "12px", width: "100%" }}
                    placeholder="Last Name"
                    variant="outlined"
                    label="Last Name"
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    sx={{ mt: "12px", width: "96%" }}
                    placeholder="Staff ID"
                    label="Staff ID"
                  />
                </Grid>
                <Grid item md={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        sx={{ width: "100%", mt: "4px" }}
                        label="Joining Date"
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>
                <Grid item md={6}>
                  <TextField
                    sx={{ mt: "12px", width: "96%" }}
                    placeholder="Position"
                    label="Position"
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    sx={{ mt: "12px", width: "100%" }}
                    placeholder="Email ID"
                    label="Email ID"
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    sx={{ mt: "12px", width: "96%" }}
                    placeholder="Phone Number"
                    label="Phone Number"
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    sx={{ mt: "12px", width: "100%" }}
                    placeholder="Department"
                    label="Department"
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    sx={{ mt: "12px", width: "96%" }}
                    placeholder="Aadhaar Number"
                    label="Aadhaar Number"
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    sx={{ mt: "12px", width: "100%" }}
                    placeholder="Pancard Number"
                    label="Pancard Number"
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    sx={{ mt: "12px", width: "96%" }}
                    placeholder="Bank Name"
                    label="Bank Name"
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    sx={{ mt: "12px", width: "100%" }}
                    placeholder="Account Number"
                    label="Account Number"
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    sx={{ mt: "12px", width: "96%" }}
                    placeholder="Ifsc Code"
                    label="Ifsc Code"
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    sx={{ mt: "12px", width: "100%" }}
                    placeholder="Salary"
                    label="Salary"
                  />
                </Grid>
                <Grid item md={12}>
                  <TextField
                    sx={{ mt: "12px", width: "100%" }}
                    placeholder="Address"
                    label="Address"
                  />
                </Grid>
                <Grid item md={12}>
                  <TextField
                    sx={{ mt: "12px", width: "100%" }}
                    placeholder="Description"
                    label="Description"
                  />
                </Grid>
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
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {/* End Employees Dialog */}

      {/* start add leave dialog */}
      <Dialog
        open={leaveOpen}
        maxWidth="sm"
        fullWidth={true}
        onClose={() => setLeaveOpen(false)}
      >
        <DialogTitle>
          <Typography sx={{ fontSize: "20px" }}>Add Leave</Typography>
        </DialogTitle>
        <Divider sx={{ marginY: "2px", color: "black" }} />
        <DialogContent>
          <Box>
            <Grid container>
              <Grid md={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={medicinesName}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Staff name"
                      placeholder="Staff name"
                    />
                  )}
                />
              </Grid>
              <Grid display="contents" mt={2}>
                <Grid md={6}>
                  <Box>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                          sx={{ width: "96%", mt: "4px" }}
                          label=" Leave From Date"
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </Box>
                </Grid>
                <Grid md={6}>
                  <Box>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                          sx={{ width: "100%", mt: "4px" }}
                          label="Leave to Date"
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </Box>
                </Grid>
              </Grid>
              <Grid md={12} mt="12px">
                <TextField
                  sx={{ width: "100%" }}
                  placeholder="Leave Reason"
                  label="Leave Reason"
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
            onClick={() => setLeaveOpen(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {/* end leave dialog */}

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
                />
              </Grid>
              <Grid md={12}>
                <Box>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        sx={{ width: "100%", mt: "4px" }}
                        label="Transaction Date"
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Box>
              </Grid>
              <Grid display="contents" mt={2}>
                <Grid md={6}>
                  <TextField
                    sx={{mt: "12px" , width: "96%" }}
                    placeholder="Transaction Type"
                    label="Transaction Type"
                  />
                </Grid>
                <Grid md={6}>
                  <TextField
                    sx={{ mt: "12px", width: "100%" }}
                    placeholder="Amount"
                    label="Amount"
                  />
                </Grid>
              </Grid>
              <Grid md={12} mt="12px">
                <TextField
                  sx={{ width: "100%" }}
                  placeholder="Description"
                  label="Description"
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
export default EmployeeList;
