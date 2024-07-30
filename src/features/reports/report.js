import * as React from 'react';
import PropTypes from 'prop-types';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { List, ListItem } from '@mui/material';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';

// Define styles for the dialog
const useStyles = makeStyles({
  paper: {
    width: '50vw',
    height: '80vh',
    maxWidth: 'none',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    transition: 'box-shadow 0.3s ease-in-out',
    '&:hover': {
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
    },
  },
  cardContent: {
    padding: 16,
  },
  cardActions: {
    padding: 16,
  },
  cardText: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
  },
  reportContent: {
    padding: 16,
    overflowY: 'auto', // To handle overflow if the content exceeds dialog height
    height: 'calc(100% - 100px)', // Adjust based on card container height
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

const cardData = [
  { label: 'Show All Loan Report Details', endpoint: 'loan/all' },
  { label: 'Show Due Loan Report Details', endpoint: 'loan/due' },
  { label: 'Show Today\'s Loan Report Details', endpoint: 'loan/today' },
  { label: 'Show All Customer Report Details', endpoint: 'customer' },
  { label: 'Show Today\'s Payments Report Details', endpoint: 'payment/today' },
  { label: 'Show Customer Statement Details', endpoint: `user_statement?customerId=` },
];

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

  const handleCardClick = (endpoint) => {
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
            <Grid container spacing={2}>
              {cardData.map(({ label, endpoint }) => (
                <Grid item xs={12} md={6} key={label}>
                  <Card
                    className={classes.card}
                    onClick={() => handleCardClick(endpoint + (endpoint.includes('customerId') ? loanId : ''))}
                  >
                    <CardContent className={classes.cardContent}>
                      <Typography className={classes.cardText}>
                        {label}
                      </Typography>
                    </CardContent>
                    <CardActions className={classes.cardActions}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleCardClick(endpoint)}
                      >
                        View Report
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
              <Grid item xs={12}>
                <Card className={classes.card} onClick={handleClose}>
                  <CardContent className={classes.cardContent}>
                    <Typography className={classes.cardText}>
                      Close
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
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
                  color="secondary"
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
