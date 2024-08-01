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
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import LoanCalculator from './LoanCalculator';

const Loan = ({ customerId, handleBack, handleShowLoanDetail ,handleStatement,customerList}) => {
  const [loanDetailsList, setLoanDetailsList] = useState([]);
  const [showLoanCalculator, setShowLoanCalculator] = useState(false);
  const [showLoan, setShowLoan] = useState(true);
  const [showCreateLoanForm, setShowsCreateLoanForm] = useState(false);
  const [selectedSortBy, setSelectedSortBy] = useState("id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [newLoanData, setNewLoanData] = useState({
    customer: { id: customerId  },
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

  const [openPaymentPopup, setOpenPaymentPopup] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentDate, setPaymentDate] = useState();
  const [customerNameList, setNameCustomerList] = React.useState(customerList);
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
    } catch (error) {
      console.error('Error fetching loan details:', error);
    }
  };

  const handleCreateLoan = async () => {
    try {
      console.log('newLoanData:', newLoanData);
      const response = await fetch(`http://localhost:8080/loan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLoanData),
      });

      if (!response.ok) {
        throw new Error('Failed to create loan');
      }
      fetchLoanDetails(selectedSortBy, page, rowsPerPage);
      setNewLoanData({
        customer: { id: customerId },
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
      alert("Loan created successfully");
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
    setSelectedLoanId(loanId);
    setOpenPaymentPopup(true);
  };

  const handlePaymentSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:8080/loan/payment?loanId=${selectedLoanId}&loanPayment=${paymentAmount}&paymentDate=${paymentDate}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        
      });

      if (!response.ok) {
        throw new Error('Failed to make payment');
      }

      setOpenPaymentPopup(false);
      fetchLoanDetails(selectedSortBy, page, rowsPerPage);
      setPaymentAmount(0);
      alert("Payment successful");
    } catch (error) {
      console.error('Error making payment:', error);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchLoanDetails(selectedSortBy, page, rowsPerPage);
      
      console.log('customerNameList Options:', customerNameList);
    }
  }, [customerId, selectedSortBy, page, rowsPerPage,customerNameList]);
 
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'customer.id') {
      setNewLoanData(prevState => ({
        ...prevState,
        customer: { id: value } // Correctly updating the nested customer object
      }));
    } else {
      setNewLoanData(prevState => ({
        ...prevState,
        [name]: value // Updating other properties as usual
      }));
    }
  };
  


  const handleBackClick = () => {
    handleBack();
  };

  const handleSortChange = (sortBy) => {
    setSelectedSortBy(sortBy);
    fetchLoanDetails(sortBy, page, rowsPerPage);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    fetchLoanDetails(selectedSortBy, newPage, rowsPerPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    fetchLoanDetails(selectedSortBy, 0, parseInt(event.target.value, 10));
  };
  const customerOptions = customerList;
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
                  <TableCell style={{ cursor: 'pointer' }} onClick={() => handleSortChange("id")}>Loan no</TableCell>
                  <TableCell style={{ cursor: 'pointer' }} onClick={() => handleSortChange("customer.name")}>Customer Name</TableCell>
                  <TableCell style={{ cursor: 'pointer' }} onClick={() => handleSortChange("firmName")}>Firm Name</TableCell>
                  <TableCell style={{ cursor: 'pointer' }} onClick={() => handleSortChange("loanDate")}>Loan Date</TableCell>
                  <TableCell style={{ cursor: 'pointer' }} onClick={() => handleSortChange("loanAmount")}>Loan Amount</TableCell>
                  <TableCell style={{ cursor: 'pointer' }} onClick={() => handleSortChange("paymentDate")}>Payment Date</TableCell>
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
                      <Stack direction="row" spacing={3}>
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
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleStatement(loan.loanId)}
                        >
                          Statement
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={loanDetailsList.length}
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
                <InputLabel id="customer-select-label">Customer</InputLabel>
                <Select
                  labelId="customer-select-label"
                  name="customer.id"
                  value={newLoanData.customer.id}
                  onChange={handleInputChange}
                >
                  {customerOptions.map((customer) => (
                    <MenuItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              </Grid>
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
      
      {/* Payment Popup */}
      <Dialog open={openPaymentPopup} onClose={() => setOpenPaymentPopup(false)}>
        <DialogTitle>Enter Payment Amount</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Payment Amount"
            type="number"
            fullWidth
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Payment Date"
            type="Date"
            fullWidth
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPaymentPopup(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handlePaymentSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Loan;
