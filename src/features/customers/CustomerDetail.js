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
import { Stack } from '@mui/material';

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
  photo: {
    width: '100%', // Fixed width for the photo
    maxWidth: '400px', // Maximum width
    height: 'auto', // Auto height to maintain aspect ratio
    maxHeight: '300px', // Maximum height
    objectFit: 'cover', // Maintain aspect ratio, cover the area
    marginBottom: 16,
  },
  documentLink: {
    display: 'block',
    width: '100%',
    maxWidth: '400px', // Fixed width for document link
    overflow: 'hidden',
    textOverflow: 'ellipsis', // Ellipsis if the link text is too long
    whiteSpace: 'nowrap',
    marginTop: 16,
  },
});

export default function CustomerDetail({ customerId }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [selectedValue, setSelectedValue] = React.useState();
  const [customerDetail, setCustomerDetail] = React.useState(null);

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  React.useEffect(() => {
    const fetchCustomerDetail = async () => {
      try {
        const response = await fetch(`http://localhost:8080/customer/id/${customerId}`, {
          method: 'GET',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch customer details');
        }
        const data = await response.json();
        setCustomerDetail(data);
      } catch (error) {
        console.error('Error fetching customer details:', error);
      }
    };

    if (open) {
      fetchCustomerDetail();
    }
  }, [open, customerId]);

  return (
    <div>
      <Dialog
        onClose={() => setOpen(false)}
        open={open}
        PaperProps={{
          className: classes.paper, // Apply custom styles
        }}
      >
        <DialogTitle>Customer Detail</DialogTitle>
        {customerDetail ? (
          <Box >
            <Stack direction="row"  marginLeft={2} spacing={2}>
           
             <Box  height={150}
             width={150}
             my={4}
             marginLeft={20}
             display="flex"
             alignItems="center"
             gap={4}
             p={2}
             sx={{ border: '2px solid grey' }}>
             <img
                src={`data:image/jpeg;base64,${customerDetail.photo}`}
                alt="Customer"
                className={classes.photo}
              />
               </Box>
           
           
               <Box  height={150}
             width={150}
             my={4}
             marginLeft={5}
             display="flex"
             alignItems="center"
             gap={4}
             p={2}
             sx={{ border: '2px solid grey' }}>
             <img
                src={`data:image/jpeg;base64,${customerDetail.document}`}
                alt="Customer"
                className={classes.photo}
              />
               </Box>
               </Stack>
           
            <List>
              {Object.entries(customerDetail)
                .filter(([key]) => key !== 'id' && key !== 'photo' && key !== 'document') 
                .map(([key, value]) => (
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
            Loading details...
          </Typography>
        )}
      </Dialog>
    </div>
  );
}

CustomerDetail.propTypes = {
  customerId: PropTypes.string.isRequired,
};
