import * as React from 'react';
import { useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  container: {
    padding: 16,
  },
  button: {
    marginTop: 16,
  },
});

export default function ReportDetails() {
  const classes = useStyles();
  const location = useLocation();
  const { data } = location.state || {}; // Get the data passed from the Reports component

  if (!data) {
    return <Typography variant="h6">No data available</Typography>;
  }

  // Check if data is an object and has entries
  const isObject = (value) => value && typeof value === 'object' && !Array.isArray(value);

  return (
    <Box className={classes.container}>
      <Typography variant="h4">Report Details</Typography>
      <List>
        {Object.entries(data).map(([key, value]) => (
          <ListItem key={key}>
            <Typography variant="body1" style={{ fontWeight: 'bold' }}>
              {key}:
            </Typography>
            <Typography variant="body1" style={{ marginLeft: 8 }}>
              {isObject(value) ? JSON.stringify(value) : value} {/* Convert objects to JSON strings */}
            </Typography>
          </ListItem>
        ))}
      </List>
      <Button
        className={classes.button}
        variant="contained"
        color="secondary"
        onClick={() => window.history.back()}
      >
        Back
      </Button>
    </Box>
  );
}
