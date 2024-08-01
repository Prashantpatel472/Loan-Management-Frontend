import { Logout } from '@mui/icons-material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PeopleIcon from '@mui/icons-material/People';
import { Box, Card, CardContent, CardHeader, Divider, Grid, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Typography, Tooltip } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import { createTheme, styled, ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import * as React from 'react';
import MainCard from '../../components/MainCard';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../reducers/authSlice';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import Loan from '../loan/loan';
import CustomersList from '../customers/CustomersList';
import Reports from '../reports/report';
import LoanDetail from '../loan/LoanDetail';
import Statement from '../loan/Statement';
import CustomerDetail from '../customers/CustomerDetail';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const defaultTheme = createTheme();

export default function Dashboard() {
  const [open, setOpen] = React.useState(true);
  const [showCustomers, setShowCustomers] = React.useState(true);
  const [showLoan, setShowLoan] = React.useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = React.useState(0);
  const [selectedSortBy, setSelectedSortBy] = React.useState("id");
  const [showReport, setShowReport] = React.useState(false);
  const [showLoanDetail, setShowLoanDetail] = React.useState(false);
  const [showCustomerDetail, setShowCustomerDetail] = React.useState(false);
  const [showsSatement, setShowsSatement] = React.useState(false);
  const [selectedLoanId, setSelectedLoanId] = React.useState(0);
  const [showDashboard, setShowDashboard] = React.useState(false);
  const [customerList, setCustomerList] = React.useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleShowLoanDetail = (loanId) => {
    setShowLoanDetail(!showLoanDetail);
    setSelectedLoanId(loanId);
  };

  const handleShowCustomerDetail = (customerId) => {
    setShowCustomerDetail(!showCustomerDetail);
    setSelectedCustomerId(customerId);
  };
  const handleStatement = (loanId) => {
    setShowsSatement(!showsSatement);
    setSelectedLoanId(loanId);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('loggedUser');
    navigate('/');
  };

  const onCustomerClick = () => {
    setShowCustomers(true);
    setShowLoan(false);
    setShowDashboard(false);
  };

  const onReportClick = () => {
    setShowReport(!showReport);
    setShowDashboard(false);
    fetchCustomerList(); 
  };
  const fetchCustomerList = async () => {
    try {
      const response = await fetch(`http://localhost:8080/customer/name`);
      if (!response.ok) {
        throw new Error('Failed to fetch customer list');
      }
      const data = await response.json();
      setCustomerList(data);
    } catch (error) {
      console.error('Error fetching customer list:', error);
    }
  };


  const handleClickShowLoan = (customerId) => {
    setSelectedCustomerId(customerId);
    fetchCustomerList(); // Fetch the customer list when clicking "Loan"
    setShowCustomers(false);
    setShowLoan(true);
    setShowDashboard(false);
    
  };
 

  const handleShowLoan = (customerId, sortBy) => {
    setShowLoan(!showLoan);
    setSelectedCustomerId(customerId);
    setShowCustomers(!showCustomers);
    setSelectedSortBy(sortBy);
    setShowDashboard(false);
  };

  const handleShowDashboard = () => {
    setShowDashboard(true);
    setShowCustomers(false);
    setShowLoan(false);
    setShowReport(false);
    setShowLoanDetail(false);
    setShowsSatement(false);
  };

  return (
    <MainCard>
      <ThemeProvider theme={defaultTheme}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar color="secondary" position="absolute" open={open}>
            <Toolbar sx={{ pr: '24px' }}>
              <IconButton
                edge="start"
                color="secondary"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{ marginRight: '36px', ...(open && { display: 'none' }) }}
              >
                <MenuIcon />
              </IconButton>
              <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                Dashboard
              </Typography>
              <IconButton color="inherit">
                <Badge badgeContent={4} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton edge="end" color="inherit" aria-label="logout" onClick={handleLogout}>
                <Logout />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={open}>
            <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: [1] }}>
              <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton>
            </Toolbar>
            <Divider />
            <List component="nav">
              <Tooltip title="Dashboard" placement="right">
                <ListItemButton onClick={handleShowDashboard} sx={{
                  minHeight: 44,
                  borderRadius: 0.75,
                  typography: 'body2',
                  color: 'text.secondary',
                  textTransform: 'capitalize',
                  fontWeight: 'fontWeightMedium',
                }}>
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
              </Tooltip>
              <Tooltip title="Loan" placement="right">
                <ListItemButton onClick={handleClickShowLoan}>
                  <ListItemIcon>
                    <ShoppingCartIcon />
                  </ListItemIcon>
                  <ListItemText primary="Loan" />
                </ListItemButton>
              </Tooltip>
              <Tooltip title="Customers" placement="right">
                <ListItemButton onClick={onCustomerClick}>
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Customers" />
                </ListItemButton>
              </Tooltip>
              <Tooltip title="Reports" placement="right">
                <ListItemButton onClick={onReportClick}>
                  <ListItemIcon>
                    <BarChartIcon />
                  </ListItemIcon>
                  <ListItemText primary="Reports" />
                </ListItemButton>
              </Tooltip>
              {/* <Tooltip title="Integrations" placement="right">
                <ListItemButton>
                  <ListItemIcon>
                    <LayersIcon />
                  </ListItemIcon>
                  <ListItemText primary="Integrations" />
                </ListItemButton>
              </Tooltip> */}
            </List>
            <Divider sx={{ my: 1 }} />
          </Drawer>
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
              flexGrow: 1,
              height: '100vh',
              overflow: 'auto',
              p: 3,
            }}
          >
            <Toolbar />
            <Grid container spacing={3}>
              {showDashboard && (
                <Grid item xs={12}>
                  <Card>
                    <CardHeader title="" />
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        Welcome to the LMS
                      </Typography>
                      <Typography variant="body1">
                        Here you can manage loans, view customers, and generate reports.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}
              {showCustomers && (
                <Grid item xs={12}>
                  <CustomersList handleShowLoan={handleShowLoan} handleShowCustomerDetail={handleShowCustomerDetail} />
                </Grid>
              )}
              {selectedCustomerId && showLoan && (
                <Grid item xs={12}>
                  <Loan customerId={selectedCustomerId} handleBack={handleShowLoan} handleShowLoanDetail={handleShowLoanDetail} handleStatement={handleStatement}customerList={customerList} />
                </Grid>
              )}
              {showReport && (
                <Grid item xs={12}>
                  <Reports customerList={customerList}/>
                </Grid>
              )}
              {showLoanDetail && (
                <Grid item xs={12}>
                  <LoanDetail loanId={selectedLoanId} />
                </Grid>
              )}
              {showCustomerDetail && (
                <Grid item xs={12}>
                  <CustomerDetail customerId={selectedCustomerId} />
                </Grid>
              )}
              {showsSatement && (
                <Grid item xs={12}>
                  <Statement loanId={selectedLoanId} />
                </Grid>
              )}
            </Grid>
          </Box>
        </Box>
      </ThemeProvider>
    </MainCard>
  );
}
