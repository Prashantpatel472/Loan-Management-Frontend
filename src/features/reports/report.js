import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { List, ListItem } from '@mui/material';

// Define styles for the dialog
const useStyles = makeStyles({
  paper: {
    width: '50vw',
    height: '80vh',
    maxWidth: 'none',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 16,
  },
  button: {
    margin: '8px 0',
  },
  reportContent: {
    padding: 16,
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
  },
  key: {
    fontWeight: 'bold',
  },
  value: {
    textAlign: 'right',
    overflowWrap: 'break-word',
  },
});

export default function Reports({ loanId }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [reportData, setReportData] = React.useState(null); // State to store report details
  const [loading, setLoading] = React.useState(false); // Loading state
  const [reportType, setReportType] = React.useState(''); // Track the type of report requested
  const [buttonsVisible, setButtonsVisible] = React.useState(true); // State to control button visibility

  const handleClose = () => {
    setOpen(false);
  };

  const fetchReportDetails = async (endpoint) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/report/${endpoint}?download=false`);
      if (!response.ok) {
        throw new Error('Failed to fetch report details');
      }
      const data = await response.json();
      setReportData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching report details:', error);
      setLoading(false);
    }
  };

  const handleButtonClick = (endpoint) => {
    setReportType(endpoint);
    fetchReportDetails(endpoint);
    setButtonsVisible(false); // Hide buttons after a click
  };

  const handleDownload = () => {
    const endpoint = reportType.replace(/^\w+\/(.+)$/, '$1'); // Extract the endpoint from reportType
    window.open(`http://localhost:8080/report/${endpoint}?download=true`, '_blank');
  };

  const handleBack = () => {
    setReportData(null);
    setButtonsVisible(true);
  };

  return (
    <div>
      <Dialog
        onClose={() => setOpen(false)}
        open={open}
        PaperProps={{
          className: classes.paper,
        }}
      >
        <DialogTitle>Reports</DialogTitle>
        <Box className={classes.buttonContainer}>
          {buttonsVisible && (
            <>
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                onClick={() => handleButtonClick('loan/all')}
              >
                Show All Loan Report Details
              </Button>
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                onClick={() => handleButtonClick('loan/due')}
              >
                Show Due Loan Report Details
              </Button>
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                onClick={() => handleButtonClick('loan/today')}
              >
                Show Today's Loan Report Details
              </Button>
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                onClick={() => handleButtonClick('customer')}
              >
                Show All Customer Report Details
              </Button>
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                onClick={() => handleButtonClick('payment/today')}
              >
                Show Today's Payments Report Details
              </Button>
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                onClick={() => handleButtonClick(`user_statement?customerId=${loanId}`)}
              >
                Show Customer Statement Details
              </Button>
              <Button
                className={classes.button}
                variant="contained"
                color="secondary"
                onClick={handleClose}
              >
                Close
              </Button>
            </>
          )}
        </Box>
        <Box className={classes.reportContent}>
          {loading && <Typography>Loading...</Typography>}
          {reportData && !loading && (
            <Box p={2}>
              <List>
                {Object.entries(reportData).map(([key, value]) => (
                  <ListItem key={key} className={classes.listItem}>
                    <Typography variant="body1" className={classes.key}>
                      {key.replace(/([A-Z])/g, ' $1').toUpperCase()}:
                    </Typography>
                    <Typography variant="body1" className={classes.value}>
                      {typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
                    </Typography>
                  </ListItem>
                ))}
              </List>
              <Box className={classes.buttonContainer}>
                <Button
                  className={classes.button}
                  variant="contained"
                  color="secondary"
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button
                  className={classes.button}
                  variant="contained"
                  color="primary"
                  onClick={handleDownload}
                >
                  Download
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Dialog>
    </div>
  );
}

Reports.propTypes = {
  loanId: PropTypes.string.isRequired,
};
