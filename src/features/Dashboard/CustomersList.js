import React, { useState, useEffect } from 'react';
import {
  Box,

  Grid,
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
  CircularProgress,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

const API_URL = 'http://localhost:8080/customer';

const CustomersList = ({ handleShowLoan }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creatingCustomer, setCreatingCustomer] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({
    name: '',
    city: '',
    phone: '',
    address: '',
    fatherName: '',
  });
  const [updatingCustomerId, setUpdatingCustomerId] = useState(null);
  const [updatingCustomerData, setUpdatingCustomerData] = useState({
   id:'',
    name: '',
    city: '',
    phone: '',
    address: '',
    fatherName: '',
  });

  useEffect(() => {
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
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomer = async (event) => {
    event.preventDefault();
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
      const updatedCustomers = customers.filter((customer) => customer.id !== customerId);
      setCustomers(updatedCustomers);
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const handleUpdateCustomer = async (customerId) => {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatingCustomerData),
      });
      if (!response.ok) {
        throw new Error('Failed to update customer');
      }
      const updatedCustomer = await response.json();
      const updatedCustomers = customers.map((customer) =>
        customer.id === customerId ? updatedCustomer : customer
      );
      setCustomers(updatedCustomers);
      cancelUpdate();
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (updatingCustomerId) {
      setUpdatingCustomerData({
        ...updatingCustomerData,
        [name]: value,
      });
    } else {
      setNewCustomerData({
        ...newCustomerData,
        [name]: value,
      });
    }
  };

  const toggleCreateCustomer = () => {
    setCreatingCustomer(!creatingCustomer);
  };

  const cancelUpdate = () => {
    setUpdatingCustomerId(null);
    setUpdatingCustomerData({
      name: '',
      city: '',
      phone: '',
      address: '',
      fatherName: '',
    });
  };

  const startUpdate = (customer) => {
    setUpdatingCustomerId(customer.id);
    setUpdatingCustomerData({
      id:customer.id,
      name: customer.name,
      city: customer.city,
      phone: customer.phone,
      address: customer.address,
      fatherName: customer.fatherName,
    });
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

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Father's Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.id}</TableCell>
                  <TableCell
                    onClick={() => handleShowLoan(customer.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {customer.id === updatingCustomerId ? (
                      <TextField
                        fullWidth
                        name="name"
                        value={updatingCustomerData.name}
                        onChange={handleInputChange}
                      />
                    ) : (
                      customer.name
                    )}
                  </TableCell>
                  <TableCell>
                    {customer.id === updatingCustomerId ? (
                      <TextField
                        fullWidth
                        name="city"
                        value={updatingCustomerData.city}
                        onChange={handleInputChange}
                      />
                    ) : (
                      customer.city
                    )}
                  </TableCell>
                  <TableCell>
                    {customer.id === updatingCustomerId ? (
                      <TextField
                        fullWidth
                        name="phone"
                        value={updatingCustomerData.phone}
                        onChange={handleInputChange}
                      />
                    ) : (
                      customer.phone
                    )}
                  </TableCell>
                  <TableCell>
                    {customer.id === updatingCustomerId ? (
                      <TextField
                        fullWidth
                        name="address"
                        value={updatingCustomerData.address}
                        onChange={handleInputChange}
                      />
                    ) : (
                      customer.address
                    )}
                  </TableCell>
                  <TableCell>
                    {customer.id === updatingCustomerId ? (
                      <TextField
                        fullWidth
                        name="fatherName"
                        value={updatingCustomerData.fatherName}
                        onChange={handleInputChange}
                      />
                    ) : (
                      customer.fatherName
                    )}
                  </TableCell>
                  <TableCell>
                    {customer.id === updatingCustomerId ? (
                      <Box>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleUpdateCustomer(customer.id)}
                        >
                          Save
                        </Button>
                        <Button variant="outlined" onClick={cancelUpdate}>
                          Cancel
                        </Button>
                      </Box>
                    ) : (
                      <IconButton onClick={() => startUpdate(customer)}>
                        <Edit />
                      </IconButton>
                    )}
                    <IconButton onClick={() => handleDeleteCustomer(customer.id)}>
                      <Delete />
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
