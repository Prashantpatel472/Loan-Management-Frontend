import * as React from 'react';
import {
  Box,
  CircularProgress,
  Grid,
  List,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  TextField,
  IconButton,
} from '@mui/material';
import requestsApi from '../../app/requestsApi';

const API_URL = 'http://localhost:8080/customer';

const CustomersList = () => {
  const [customers, setCustomers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [creatingCustomer, setCreatingCustomer] = React.useState(false);
  const [newCustomerData, setNewCustomerData] = React.useState({
    name: '',
    city: '',
    phone: '',
    address: '',
    fatherName: '',
  });

  React.useEffect(() => {
    getCustomers();
  }, []);

  const getCustomers = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      // Handle error state or show error message
    } finally {
      
    }
  };

  const handleCreateCustomer = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomerData),
      });
      if (!response.ok) {
        throw new Error('Failed to create customer');
      }
      const createdCustomer = await response.json();
      setCustomers([...customers, createdCustomer]);
      setNewCustomerData({
        name: '',
        city: '',
        phone: '',
        address: '',
        fatherName: '',
      });
      setCreatingCustomer(false);
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      const response = await fetch(`${API_URL}/${customerId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete customer');
      }
      // Filter out the deleted customer from the list
      const updatedCustomers = customers.filter((customer) => customer.id !== customerId);
      setCustomers(updatedCustomers);
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewCustomerData({
      ...newCustomerData,
      [name]: value,
    });
  };

  const toggleCreateCustomer = () => {
    setCreatingCustomer(!creatingCustomer);
    setLoading(!loading);
  };

  return (
    <Box>
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Customers List</Typography>
        {!creatingCustomer ? (
          <Button variant="contained" onClick={toggleCreateCustomer}>
            Create Customer
          </Button>
        ) : (
          <Button variant="outlined" onClick={toggleCreateCustomer}>
            Cancel
          </Button>
        )}
      </Grid>

      {creatingCustomer && (
        <Box mt={2}>
          <Typography variant="h6">Create New Customer</Typography>
          <form onSubmit={handleCreateCustomer}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={newCustomerData.name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={newCustomerData.city}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={newCustomerData.phone}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={newCustomerData.address}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Father's Name"
                  name="fatherName"
                  value={newCustomerData.fatherName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  Save Customer
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      )}

      {loading && (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Father's Name</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.city}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.address}</TableCell>
                  <TableCell>{customer.fatherName}</TableCell>
                  <TableCell>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDeleteCustomer(customer.id)}
                    >
                      Delete
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default CustomersList;
