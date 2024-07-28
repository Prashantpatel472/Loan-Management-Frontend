import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';

// Define styles for the dialog
const useStyles = makeStyles({
  paper: {
    width: '50vw',
    height: '80vh',
    maxWidth: 'none',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 24,
    paddingRight: 24,
  },
  key: {
    fontWeight: 'bold',
  },
  value: {
    textAlign: 'right',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: 16,
  },
});

export default function Statement({ loanId }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [loanDetails, setLoanDetails] = React.useState([]);
  const [loanInfo, setLoanInfo] = React.useState(null);

  const handleClose = (value) => {
    setOpen(false);
    // Handle close actions if necessary
  };

  React.useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/loan/statement/${loanId}`, {
          method: 'GET',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch loan details');
        }
        const data = await response.json();
        setLoanDetails(data);
        
        // Extract loan info from the first record
        if (data.length > 0) {
          setLoanInfo(data[0].loan);
        }
      } catch (error) {
        console.error('Error fetching loan details:', error);
      }
    };

    if (open) {
      fetchLoanDetails();
    }
  }, [open, loanId]);

  return (
    <div>
      <Dialog
        onClose={() => setOpen(false)}
        open={open}
        PaperProps={{
          className: classes.paper, // Apply custom styles
        }}
      >
        <DialogTitle>Statement</DialogTitle>
        {loanInfo && loanDetails.length > 0 ? (
          <Box p={2}>
            <Typography variant="h6">Loan Information</Typography>
            <List>
              {Object.entries(loanInfo).map(([key, value]) => (
                <ListItem key={key} className={classes.listItem}>
                  <Typography variant="body1" className={classes.key}>
                    {key.replace(/([A-Z])/g, ' $1').toUpperCase()}:
                  </Typography>
                  <Typography variant="body1" className={classes.value}>
                    {value.toString()}
                  </Typography>
                </ListItem>
              ))}
            </List>

            <Typography variant="h6" mt={2}>Payment Records</Typography>
            <List>
              {loanDetails.map((record) => (
                <ListItem key={record.id} className={classes.listItem}>
                  <Box>
                    <Typography variant="body1" className={classes.key}>
                      Payment Date:
                    </Typography>
                    <Typography variant="body1" className={classes.value}>
                      {record.paymentDate}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body1" className={classes.key}>
                      Interest Payment Amount:
                    </Typography>
                    <Typography variant="body1" className={classes.value}>
                      {record.interestPaymentAmount}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body1" className={classes.key}>
                      Loan Payment Amount:
                    </Typography>
                    <Typography variant="body1" className={classes.value}>
                      {record.loanPaymentAmount}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>

            <Box className={classes.buttonContainer}>
              <Button variant="contained" color="secondary" onClick={() => handleClose(null)}>
                Close
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography variant="body1" component="div" sx={{ p: 2 }}>
            Loading statement details...
          </Typography>
        )}
      </Dialog>
    </div>
  );
}

Statement.propTypes = {
  loanId: PropTypes.string.isRequired,
};
