import React, { useState } from 'react';
import { Button, Grid, Paper, TextField, Typography } from '@mui/material';

const LoanCalculator = () => {
  const [loanDetails, setLoanDetails] = useState(null);
  const [loanData, setLoanData] = useState({
    loanAmount: 0,
    monthlyInterestRate: 0, // Interest rate per month
    timePeriodDays: 30, // Default time period
  });

  const calculateLoan = () => {
    const { loanAmount, monthlyInterestRate, timePeriodDays } = loanData;
    const parsedLoanAmount = parseFloat(loanAmount);
    const parsedMonthlyInterestRate = parseFloat(monthlyInterestRate) / 100; // Convert percentage to decimal
    const parsedTimePeriodDays = parseFloat(timePeriodDays);

    if (isNaN(parsedLoanAmount) || isNaN(parsedMonthlyInterestRate) || isNaN(parsedTimePeriodDays)) {
      alert('Please enter valid numeric values for Loan Amount, Monthly Interest Rate, and Time Period.');
      return;
    }

    // Convert days to months
    const totalMonths = parsedTimePeriodDays / 30; // Approximate number of months

    // Calculate total interest
    const totalInterest = parsedLoanAmount * parsedMonthlyInterestRate * totalMonths;

    // Calculate total amount payable
    const totalAmountPayable = parsedLoanAmount + totalInterest;

    setLoanDetails({
      loanAmount: parsedLoanAmount,
      monthlyInterestRate: parsedMonthlyInterestRate * 100, // Convert back to percentage for display
      totalInterest,
      totalAmountPayable,
    });
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Loan Calculator
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Loan Amount"
            type="number"
            value={loanData.loanAmount}
            onChange={(e) => setLoanData({ ...loanData, loanAmount: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Monthly Interest Rate (%)"
            type="number"
            variant="outlined"
            value={loanData.monthlyInterestRate}
            onChange={(e) => setLoanData({ ...loanData, monthlyInterestRate: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Time Period (Days)"
            type="number"
            value={loanData.timePeriodDays}
            onChange={(e) => setLoanData({ ...loanData, timePeriodDays: e.target.value })}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="secondary" onClick={calculateLoan}>
            Calculate Loan
          </Button>
        </Grid>
        {loanDetails && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2, mt: 2 }}>
              <Typography>Total Interest: {loanDetails.totalInterest.toFixed(2)}</Typography>
              <Typography>Total Amount Payable: {loanDetails.totalAmountPayable.toFixed(2)}</Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default LoanCalculator;
