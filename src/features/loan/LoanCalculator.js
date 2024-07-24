import React, { useState } from 'react';
import { Button, Grid, Paper, TextField, Typography, MenuItem } from '@mui/material';

const LoanCalculator = () => {
  const [loanDetails, setLoanDetails] = useState(null);
  const [loanData, setLoanData] = useState({
    loanAmount: 0,
    interestRate: 0,
    tenureYears: 1,
    frequency: 'Yearly', 
    timePeriodDays: 1,   
    timePeriodMonths: 1, 
  });

  const frequencyOptions = ['Yearly', 'Monthly', 'Daily'];

  const calculateLoan = () => {
    const { loanAmount, interestRate, tenureYears, frequency, timePeriodDays, timePeriodMonths } = loanData;
    const parsedLoanAmount = parseFloat(loanAmount);
    const parsedInterestRate = parseFloat(interestRate);
    const parsedTenureYears = parseFloat(tenureYears);
    const parsedTimePeriodDays = parseFloat(timePeriodDays);
    const parsedTimePeriodMonths = parseFloat(timePeriodMonths);

    if (isNaN(parsedLoanAmount) || isNaN(parsedInterestRate) || isNaN(parsedTenureYears)) {
      alert('Please enter valid numeric values for Loan Amount, Interest Rate, and Tenure.');
      return;
    }

    let totalInterest = 0;
    let totalAmountPayable = parsedLoanAmount;

    if (frequency === 'Yearly') {
      const yearlyInterestRate = parsedInterestRate / 100;
      totalInterest = parsedLoanAmount * yearlyInterestRate * parsedTenureYears;
      totalAmountPayable += totalInterest;
    } else if (frequency === 'Monthly') {
      const monthlyInterestRate = parsedInterestRate / 12 / 100;
      const totalMonths = parsedTenureYears * 12;
      totalInterest = parsedLoanAmount * monthlyInterestRate * totalMonths;
      totalAmountPayable += totalInterest;
    } else if (frequency === 'Daily') {
      const dailyInterestRate = parsedInterestRate / 365 / 100;
      const totalDays = parsedTenureYears * 365;

      if (parsedTimePeriodDays > 0) {
        const effectiveInterestRate = Math.pow(1 + dailyInterestRate, parsedTimePeriodDays / 365) - 1;
        totalInterest = parsedLoanAmount * effectiveInterestRate;
      } else {
        totalInterest = parsedLoanAmount * dailyInterestRate * totalDays;
      }

      totalAmountPayable += totalInterest;
    }

    // Adjust for specific time periods
    if (frequency === 'Monthly' && parsedTimePeriodMonths > 0) {
      totalInterest *= parsedTimePeriodMonths;
      totalAmountPayable += totalInterest;
    }

    setLoanDetails({
      loanAmount: parsedLoanAmount,
      interestRate: parsedInterestRate,
      tenureYears: parsedTenureYears,
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
            label="Interest Rate (%)"
            type="number"
            variant="outlined"
            value={loanData.interestRate}
            onChange={(e) => setLoanData({ ...loanData, interestRate: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Tenure (Years)"
            type="number"
            variant="outlined"
            value={loanData.tenureYears}
            onChange={(e) => setLoanData({ ...loanData, tenureYears: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            select
            fullWidth
            label="Interest Calculation Frequency"
            value={loanData.frequency}
            onChange={(e) => setLoanData({ ...loanData, frequency: e.target.value })}
          >
            {frequencyOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
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
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Time Period (Months)"
            type="number"
            value={loanData.timePeriodMonths}
            onChange={(e) => setLoanData({ ...loanData, timePeriodMonths: e.target.value })}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={calculateLoan}>
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
