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
    width: '40vw',
    height: '100vh',
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

export default function Reports({ loanId }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [selectedValue, setSelectedValue] = React.useState();
  const [loanDetail, setLoanDetail] = React.useState({1:"dueDate"});

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  React.useEffect(() => {
    const fetchLoanDetail = async () => {
      try {
        const response = await fetch(`http://localhost:8080/loan/${loanId}`, {
          method: 'GET',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch loan details');
        }
        const data = await response.json();
        setLoanDetail(data);
      } catch (error) {
        console.error('Error fetching loan details:', error);
      }
    };

    if (open) {
      fetchLoanDetail();
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
        <DialogTitle>Reports</DialogTitle>
        {loanDetail ? (
          <Box p={2}>
            <List>
              {Object.entries(loanDetail).map(([key, value]) => (
                <ListItem key={key} className={classes.listItem}>
                  <Typography variant="body1" className={classes.key}>
                    {key.replace(/([A-Z])/g, ' $1').toUpperCase()}:
                  </Typography>
                  <Typography variant="body1" className={classes.value}>
                    {value}
                  </Typography>
                </ListItem>
              ))}
            </List>
            <Box className={classes.buttonContainer}>
              <Button variant="contained" color="secondary" onClick={() => handleClose(null)}>
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography variant="body1" component="div" sx={{ p: 2 }}>
            Loading Reports...
          </Typography>
        )}
      </Dialog>
    </div>
  );
}

