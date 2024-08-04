import { DialogActions, DialogContent, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import React, { useState } from 'react';



export default function Payment({ loanId }) {
 
 
  const [openPaymentPopup, setOpenPaymentPopup] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentDate, setPaymentDate] = useState( );
  

  const handlePaymentSubmit = async () => {
    try {
      const response = await fetch(`http://${APIHEADER}:8080/loan/payment?loanId=${selectedLoanId}&loanPayment=${paymentAmount}&paymentDate=${paymentDate}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        
      });

      if (!response.ok) {
        throw new Error('Failed to make payment');
      }

      setOpenPaymentPopup(false);
      
      setPaymentAmount(0);
      alert("Payment successful");
    } catch (error) {
      console.error('Error making payment:', error);
    }
  };
  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

 

  return (
   <Dialog open={openPaymentPopup} onClose={() => setOpenPaymentPopup(false)}>
   <DialogTitle>Enter Payment Amount</DialogTitle>
   <DialogContent>
     <TextField
       label="Payment Amount"
       type="number"
       fullWidth
       value={paymentAmount}
       onChange={(e) => setPaymentAmount(e.target.value)}
     />
     <TextField
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
  );
}

