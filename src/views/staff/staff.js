import React, { useState } from "react";
import {
  Button,
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

// ==============================|| Employee ||============================== //

const displayStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent : "space-between",
};

const addButtonStyle = {
  justifyContent: "flex-end",
};

const Staff = () => {
  const [open, setOpen] = useState(null);

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
                Staff
              </Typography>
            </Box>
            <Box>
              <Button
                variant="contained"
                sx={addButtonStyle}
                startIcon={<IconCirclePlus />}
              >
                Add Staff
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
                    <TableCell align="center">Employee Name</TableCell>
                    <TableCell align="center">Position</TableCell>
                    <TableCell align="center">Department</TableCell>
                    <TableCell align="center">Phone Number</TableCell>
                    <TableCell align="center">Salary</TableCell>
                    <TableCell align="center">Join Date</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableCell align="center">1</TableCell>
                  <TableCell align="center">Abhishek Savaliya</TableCell>
                  <TableCell align="center">senior Developer </TableCell>
                  <TableCell align="center">Web Development</TableCell>
                  <TableCell align="center">123456789</TableCell>
                  <TableCell align="center">15000</TableCell>
                  <TableCell align="center">29-07-23</TableCell>
                  <TableCell align="right">
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
    </>
  );
};

export default Staff;
