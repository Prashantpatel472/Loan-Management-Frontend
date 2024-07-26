import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  TablePagination, // Import TablePagination
} from '@mui/material';
import LoanCalculator from './LoanCalculator';

const Loan = ({ customerId, handleBack, handleShowLoanDetail }) => {
  const [loanDetailsList, setLoanDetailsList] = useState([]);
  const [showLoanCalculator, setShowLoanCalculator] = useState(false);
  const [showLoan, setShowLoan] = useState(true);
  const [showCreateLoanForm, setShowsCreateLoanForm] = useState(false);
  const [selectedSortBy, setSelectedSortBy] = useState("id");
  const [page, setPage] = useState(0); // Current page state
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page

  const [newLoanData, setNewLoanData] = useState({
    customer: {
      id: customerId,
    },
    firmName: '',
    loanDescription: '',
    loanDate: '',
    loanAmount: '',
    loanInterest: '',
    loanPeriodInDays: '',
    interestFrequency: '',
    securityItemDescription: '',
    loanType: '',
    modifiedDate: '',
    totalPaidInterest: 0,
    isClosed: false,
  });

  const firms = ['Firm1', 'Firm2', 'Firm3'];
  const loanTypes = ['gold', 'property', 'other'];

  const fetchLoanDetails = async (sortBy, page, size) => {
    let id = isNaN(parseFloat(customerId)) ? 0 : customerId;
    try {
      const response = await fetch(`http://localhost:8080/loan?customerId=${id}&page=${page}&size=${size}&sortBy=${sortBy}`);
      if (!response.ok) {
        throw new Error('Failed to fetch loan details');
      }
      const data = await response.json();
      setLoanDetailsList(data.content);
      // Update total rows if provided by the API
      // setTotalRows(data.totalElements);
    } catch (error) {
      console.error('Error fetching loan details:', error);
    }
  };

  const handleCreateLoan = async () => {
    try {
      console.log('newLoanData:', newLoanData);

      JSON.stringify(newLoanData);

      const response = await fetch(`http://localhost:8080/loan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLoanData),
      });

      if (!response.ok) {
        throw new Error('Failed to create loan');
      }
      fetchLoanDetails(selectedSortBy, page, rowsPerPage);

      setNewLoanData({
        customer: {
          id: customerId,
        },
        firmName: '',
        loanDescription: '',
        loanDate: '',
        loanAmount: '',
        loanInterest: '',
        loanPeriodInDays: '',
        interestFrequency: '',
        securityItemDescription: '',
        loanType: '',
        modifiedDate: '',
        totalPaidInterest: 0,
        isClosed: false,
      });

      setShowLoan(true);
      setShowsCreateLoanForm(false);
      alert("loan created successfully")
    } catch (error) {
      console.error('Error creating loan:', error);
    }
  };

  const handleDeleteLoan = async (loanId) => {
    try {
      const response = await fetch(`http://localhost:8080/loan/delete/${loanId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete loan');
      }

      fetchLoanDetails(selectedSortBy, page, rowsPerPage);
    } catch (error) {
      console.error('Error deleting loan:', error);
    }
  };

  const handlePayment = async (loanId) => {
    try {
      const response = await fetch(`http://localhost:8080/loan/${loanId}`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error('Failed to update loan');
      }

      fetchLoanDetails(selectedSortBy, page, rowsPerPage);
    } catch (error) {
      console.error('Error updating loan:', error);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchLoanDetails(selectedSortBy, page, rowsPerPage);
    }
  }, [customerId, selectedSortBy, page, rowsPerPage]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewLoanData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleBackClick = () => {
    handleBack();
  };

  const handleSortChange = (sortBy) => {
    setSelectedSortBy(sortBy);
    fetchLoanDetails(sortBy, page, rowsPerPage);
  };

  // Handle page changes
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    fetchLoanDetails(selectedSortBy, newPage, rowsPerPage);
  };

  // Handle rows per page changes
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to 0 on rows per page change
    fetchLoanDetails(selectedSortBy, 0, parseInt(event.target.value, 10));
  };

  return (
    <Box>
      {showLoan && (
        <Card>
          <Grid container justifyContent="space-between" alignItems="center">
            <Typography variant="h6" gutterBottom>
              Loan Details
            </Typography>
            <Stack direction="row" spacing={2}>
              {!showCreateLoanForm ? (
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() => { setShowsCreateLoanForm(!showCreateLoanForm); setShowLoan(!showLoan); }}
                >
                  Create New Loan
                </Button>
              ) : (
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() => { setShowsCreateLoanForm(!showCreateLoanForm); setShowLoan(!showLoan); }}
                >
                  Cancel
                </Button>
              )}
              <Button color="secondary" variant="contained" onClick={handleBackClick}>
                Back
              </Button>
            </Stack>
          </Grid>

          <TableContainer component={Card}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell onClick={() => handleSortChange("id")}>Loan no</TableCell>
                  <TableCell onClick={() => handleSortChange("name")}>Customer Name</TableCell>
                  <TableCell onClick={() => handleSortChange("firmName")}>Firm Name</TableCell>
                  <TableCell onClick={() => handleSortChange("loanDate")}>Loan Date</TableCell>
                  <TableCell onClick={() => handleSortChange("loanAmount")}>Loan Amount</TableCell>
                  <TableCell onClick={() => handleSortChange("paymentDate")}>Payment Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loanDetailsList.map((loan, index) => (
                  <TableRow key={index}>
                    <TableCell>{loan.loanId}</TableCell>
                    <TableCell>{loan.name}</TableCell>
                    <TableCell>{loan.firmName}</TableCell>
                    <TableCell>{loan.loanDate}</TableCell>
                    <TableCell>{loan.loanAmount}</TableCell>
                    <TableCell>{loan.paymentDate}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2}>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleShowLoanDetail(loan.loanId)}
                        >
                          Show Loan Detail
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handlePayment(loan.loanId)}
                        >
                          Payment
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Add TablePagination component */}
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={loanDetailsList.length} // You may need to update this based on your total number of rows
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </Card>
      )}

      {showCreateLoanForm && (
        <Box mt={4}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Firm Name</InputLabel>
                <Select
                  name="firmName"
                  value={newLoanData.firmName}
                  onChange={handleInputChange}
                >
                  {firms.map((firm) => (
                    <MenuItem key={firm} value={firm}>
                      {firm}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Description"
                name="loanDescription"
                value={newLoanData.loanDescription}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Loan Date"
                name="loanDate"
                value={newLoanData.loanDate}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Loan Amount"
                name="loanAmount"
                value={newLoanData.loanAmount}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Loan Interest"
                name="loanInterest"
                value={newLoanData.loanInterest}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Loan Period (Days)"
                name="loanPeriodInDays"
                value={newLoanData.loanPeriodInDays}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Interest Frequency</InputLabel>
                <Select
                  name="interestFrequency"
                  value={newLoanData.interestFrequency}
                  onChange={handleInputChange}
                >
                  {[1, 2, 3, 6].map((freq) => (
                    <MenuItem key={freq} value={freq}>
                      {freq} month{freq > 1 && 's'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Security Item Description"
                name="securityItemDescription"
                value={newLoanData.securityItemDescription}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Loan Type</InputLabel>
                <Select
                  name="loanType"
                  value={newLoanData.loanType}
                  onChange={handleInputChange}
                >
                  {loanTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleCreateLoan}
              >
                Create Loan
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item>
          <Button color='secondary' variant="contained" onClick={() => setShowLoanCalculator(!showLoanCalculator)}>
            {showLoanCalculator ? 'Hide Calculator' : 'Show Calculator'}
          </Button>
        </Grid>
      </Grid>

      {showLoanCalculator && <LoanCalculator />}
    </Box>
  );
};

export default Loan;
