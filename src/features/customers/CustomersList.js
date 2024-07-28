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
  TablePagination,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

const API_URL = 'http://localhost:8080/customer';

const CustomersList = ({ handleShowLoan }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); 
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5); 

  const [customerData, setCustomerData] = useState({
    name: '',
    fatherName: '',
    phone: '',
    alternatePhone: '',
    pincode: '',
    state: '',
    district: '',
    city: '',
    address: '',
    aadharNumber: '',
    customerLimit: '1000',
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [image, setImage] = useState(null);
  const [document, setDocument] = useState(null);

  useEffect(() => {
    getCustomers();
  }, [currentPage, pageSize]); // Re-fetch customers when page changes or page size changes

  const getCustomers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}?page=${currentPage}&size=${pageSize}&sortBy=id`);
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      const data = await response.json();
      setCustomers(data.content); // Adjust if your API response structure is different
      setTotalPages(data.totalPages); // Set total pages
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCustomer = async (event) => {
    event.preventDefault();
    try {
      const { photo, document, ...customerDataWithoutFiles } = customerData;

      // Validate inputs (example for phone number and name)
      if (!/^\d{10}$/.test(customerDataWithoutFiles.phone)) {
        alert("Phone number must be 10 digits");
        return;
      }
      if (customerDataWithoutFiles.name.length < 1 || customerDataWithoutFiles.name.length > 100) {
        alert("Name must be between 1 and 100 characters");
        return;
      }

      const formData = new FormData();
      formData.append('customer', JSON.stringify(customerDataWithoutFiles));
      if (image) {
        formData.append('photo', image);
      }
      if (document) {
        formData.append('document', document);
      }

      const method = isEditing ? 'PUT' : 'POST';
      const url = API_URL;

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? 'update' : 'create'} customer`);
      }
      setShowForm(!showForm);
      setIsCreating(!isCreating);
      getCustomers(); 
      alert("Customer saved successfully");   
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} customer:`, error);
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
      setCustomers((prevCustomers) =>
        prevCustomers.filter((customer) => customer.id !== customerId)
      );
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const handleInputChange = async (event) => {
    const { name, value } = event.target;
    setCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeImage = (event) => {
    const file = event.target.files[0];
    setImage(file);

    convertToBase64(file).then((base64) => {
      setImagePreview(base64);
      setCustomerData((prevData) => ({
        ...prevData,
        photo: base64,
      }));
    });
  };

  const handleChangeDocument = (event) => {
    const file = event.target.files[0];
    setDocument(file);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const startUpdate = (customer) => {
    setIsEditing(true);
    setShowForm(true);
    setIsCreating(true);
    setCustomerData(customer);
  };

  const handleCreate = () => {
    setShowForm(!showForm);
    setIsCreating(!isCreating);
    setCustomerData({
      name: '',
      fatherName: '',
      phone: '',
      alternatePhone: '',
      pincode: '',
      state: '',
      district: '',
      city: '',
      address: '',
      aadharNumber: '',
      customerLimit: '1000',
    });
    setImagePreview(null);
  };

  const resetForm = () => {
    setIsEditing(!isEditing);
    setCustomerData({
      name: '',
      fatherName: '',
      phone: '',
      alternatePhone: '',
      pincode: '',
      state: '',
      district: '',
      city: '',
      address: '',
      aadharNumber: '',
      customerLimit: '1000',
    });
    setImagePreview(null);
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage); // `newPage` is zero-based index
  };

  const handleRowsPerPageChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setCurrentPage(0); // Reset page to 0 on rows per page change
  };

  return (
    <Box>
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Customers List</Typography>
        <Button color="secondary" variant="contained" onClick={handleCreate}>
          {isCreating ? 'Cancel' : 'Create Customer'}
        </Button>
      </Grid>
      {showForm &&
        <Box mt={2}>
          <Typography variant="h6">{isEditing ? 'Update Customer' : 'Create New Customer'}</Typography>
          <form onSubmit={handleSaveCustomer}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  name="name"
                  value={customerData.name}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Father's Name"
                  name="fatherName"
                  value={customerData.fatherName}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone"
                  name="phone"
                  value={customerData.phone}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Alternate Phone"
                  name="alternatePhone"
                  value={customerData.alternatePhone}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Pincode"
                  name="pincode"
                  value={customerData.pincode}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="State"
                  name="state"
                  value={customerData.state}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="District"
                  name="district"
                  value={customerData.district}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="City"
                  name="city"
                  value={customerData.city}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Address"
                  name="address"
                  value={customerData.address}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Aadhar Number"
                  name="aadharNumber"
                  value={customerData.aadharNumber}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Customer Limit"
                  name="customerLimit"
                  value={customerData.customerLimit}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
              <Box mt={2}>
                <input
                  accept="image/*"
                  type="file"
                  onChange={handleChangeImage}
                  id="select-image"
                  style={{ display: 'none' }}
                />
                <label htmlFor="select-image">
                  <Button variant="contained" color="secondary" component="span">
                    Upload Image
                  </Button>
                </label>
                </Box>
                {imagePreview && <img src={imagePreview} alt="Image Preview" width="100" />}
              </Grid>
              <Grid item xs={12} sm={6}>
                <input
                  accept=".pdf,.doc,.docx"
                  type="file"
                  onChange={handleChangeDocument}
                  id="select-document"
                  style={{ display: 'none' }}
                />
                <label htmlFor="select-document">
                  <Button variant="contained" color="secondary" component="span">
                    Upload Document
                  </Button>
                </label>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="secondary" type="submit">
                  {isEditing ? 'Update' : 'Save'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      }
      <Box mt={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer Id</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Father Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Phone no</TableCell>
                <TableCell>Aadhar Number</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell onClick={() => handleShowLoan(customer.id)} style={{ cursor: 'pointer' }}>
                      {customer.id}
                    </TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.fatherName}</TableCell>
                    <TableCell>{customer.address + ", " + customer.city + ", " + customer.district + ", " + customer.state + ", " + customer.pincode}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.aadharNumber}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => startUpdate(customer)}>
                        <Edit />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[2, 5, 10]}
          component="div"
          count={totalPages * pageSize} // Total count of items
          rowsPerPage={pageSize}
          page={currentPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Box>
    </Box>
  );
};

export default CustomersList;
