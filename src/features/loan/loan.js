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
  Typography
} from '@mui/material';
import LoanCalculator from './LoanCalculator';

const Loan = ({ customerId, handleBack }) => {
  const [loanDetailsList, setLoanDetailsList] = useState([]);
  const [showLoanCalculator, setShowLoanCalculator] = useState(false);
  const [showLoan, setShowLoan] = useState(true);
  const [showCreateLoanForm, setShowsCreateLoanForm] = useState(false);

  const [newLoanData, setNewLoanData] = useState({
    "customer": {
        "id": customerId
    },
    firmName: '',
    loanDescription: '',
    loanDate: '',
    loanAmount: '',
    loanInterest: '',
    loanPeriodInMonths: '',
  });

  const fetchLoanDetails = async (customerId) => {
    let id = isNaN(parseFloat(customerId)) ? 0 : customerId;
    try {
      const response = await fetch(`http://localhost:8080/loan/getAll?customerId=${id}&page=0&size=20&sortBy=id`);
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
      const response = await fetch(`http://localhost:8080/loan/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLoanData),
      });
      if (!response.ok) {
        throw new Error('Failed to create loan');
      }
  
      fetchLoanDetails(customerId); // Refresh loan details after creating
      setNewLoanData({
        ...newLoanData,
        firmName: '',
        loanDescription: '',
        loanDate: '',
        loanAmount: '',
        loanInterest: '',
        loanPeriodInMonths: '',
      });
      setShowLoan(true); // Show loan details view after creating
      setShowsCreateLoanForm(false); // Hide create loan form after creating
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

      const updatedLoanList = loanDetailsList.filter(loan => loan.id !== loanId);
      setLoanDetailsList(updatedLoanList);
    } catch (error) {
      console.error('Error deleting loan:', error);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchLoanDetails(customerId);
    }
  }, [customerId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewLoanData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleBackClick = () => {
    // Example back functionality
    handleBack(); // Assuming handleBack is a prop function passed from parent component
  };

  return (
    <Box>
      {showLoan && <Card>
        <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h6" gutterBottom>
          Loan Details
        </Typography>
       
          {!showCreateLoanForm ? (
           <Button variant="outlined" onClick={() => { setShowsCreateLoanForm(!showCreateLoanForm); setShowLoan(!showLoan); }}>
           Create New Loan
         </Button>
        ) : (
          <Button variant="outlined" onClick={() => { setShowsCreateLoanForm(!showCreateLoanForm); setShowLoan(!showLoan); }}>
            Cancel
          </Button>
        )}
         <Button variant="outlined" onClick={handleBack}>
            Back
          </Button>
</Grid>

        <TableContainer component={Card}>
          <Table>
            <TableHead>
              <TableRow>
              <TableCell>Loan no</TableCell>
                <TableCell>Firm Name</TableCell>
                <TableCell>Loan Date</TableCell>
                <TableCell>Loan Amount</TableCell>
                <TableCell>Payment Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loanDetailsList.map((loan, index) => (
                <TableRow key={index}>
                   <TableCell>{loan.loanId}</TableCell>
                  <TableCell>{loan.firmName}</TableCell>
                  <TableCell>{loan.loanDate}</TableCell>
                  <TableCell>{loan.loanAmount}</TableCell>
                  <TableCell>{loan.paymentDate}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDeleteLoan(loan.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>}

      {showCreateLoanForm && <Box mt={4}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Customers List</Typography>
        
        {!showCreateLoanForm ? (
           <Button variant="outlined" onClick={() => { setShowsCreateLoanForm(!showCreateLoanForm); setShowLoan(!showLoan); }}>
           Create New Loan
         </Button>

         ) : (
          <Button variant="outlined" onClick={() => { setShowsCreateLoanForm(!showCreateLoanForm); setShowLoan(!showLoan); }}>
            Cancel
          </Button>
        )}
        
      </Grid>
     
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Firm Name"
              name="firmName"
              value={newLoanData.firmName}
              onChange={handleInputChange}
            />
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
              label="Loan Period (Months)"
              name="loanPeriodInMonths"
              value={newLoanData.loanPeriodInMonths}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateLoan}
            >
              Create Loan
            </Button>
            
          </Grid>
        </Grid>
      </Box>}

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item>
          <Button variant="outlined" onClick={() => setShowLoanCalculator(!showLoanCalculator)}>
            {showLoanCalculator ? 'Hide Calculator' : 'Show Calculator'}
          </Button>
        
          
        </Grid>
      </Grid>

      {showLoanCalculator && <LoanCalculator />}
    </Box>
  );
};

export default Loan;
