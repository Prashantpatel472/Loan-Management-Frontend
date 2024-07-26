import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';

const reportList = ['Due Amount', 'All Loans','All Customers'];

function SimpleDialog(props) {
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = async(value) => {
    try {
      const response = await fetch(`http://localhost:8080/report/loan/all`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Failed to delete customer');
      }
      
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>get report</DialogTitle>
      <List sx={{ pt: 0 }}>
        {reportList.map((report) => (
          <ListItem disableGutters key={report}>
            <ListItemButton onClick={() => handleListItemClick(report)}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                 
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={report} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disableGutters>
          <ListItemButton
            autoFocus
            onClick={() => handleListItemClick('addAccount')}
          >
            <ListItemAvatar>
              <Avatar>
                <AddIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Add account" />
          </ListItemButton>
        </ListItem>
      </List>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

export default function Reports() {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(reportList[0]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <div>
      <Typography variant="subtitle1" component="div">
        Selected: {selectedValue}
      </Typography>
      <br />
      <Button variant="contained" onClick={handleClickOpen}>
        Open Report
      </Button>
      <SimpleDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
}
