// features/Dashboard/Dashboard.js
import { Logout } from '@mui/icons-material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PeopleIcon from '@mui/icons-material/People';
import { Box, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { alpha, createTheme, styled, ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
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
  const [showCustomers, setShowCustomers] = React.useState(true); // State to control showing CustomersList
  const [showLoan, setShowLoan] = React.useState(false); // State to control showing Loan
  const [selectedCustomerId, setSelectedCustomerId] = React.useState(0);
  const [selectedSortBy, setSelectedSortBy] = React.useState("id");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showReport, setShowReport] = React.useState(false);
  const [showLoanDetail, setShowLoanDetail] = React.useState(false);
  const [selectedLoanId, setSelectedLoanId] = React.useState(0);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  
  const handleShowLoanDetail = (loanId) => {
    setShowLoanDetail(!showLoanDetail)
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
  };
  const onReportClick = () => {
   
    setShowReport(!showReport); 
  };
  

  const handleClickShowLoan = (customerId) => {
    setShowCustomers(false);
    setSelectedCustomerId(customerId);
    setShowLoan(true);
  };

  const handleShowLoan = (customerId,sortBy) => {
    setShowLoan(!showLoan);
    setSelectedCustomerId(customerId);
    setShowCustomers(!showCustomers);
    setSelectedSortBy(sortBy);
  };

  return (
    <MainCard>
      <ThemeProvider theme={defaultTheme}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar  color="secondary"  position="absolute" open={open}>
            <Toolbar
              sx={{
                pr: '24px', // keep right padding when drawer closed
              }}
            >
              <IconButton
                edge="start"
                color="secondary" 
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  marginRight: '36px',
                  ...(open && { display: 'none' }),
                }}
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
            <Toolbar
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                px: [1],
              }}
            >
              <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton>
            </Toolbar>
            <Divider />
            <List component="nav">
              <ListItemButton sx={{
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
              <ListItemButton onClick={handleClickShowLoan}>
                <ListItemIcon>
                  <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="Loan" />
              </ListItemButton>
              <ListItemButton onClick={onCustomerClick}>
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Customers" />
              </ListItemButton>
              <ListItemButton onClick={onReportClick}>
                <ListItemIcon >
                  <BarChartIcon />
                </ListItemIcon>
                <ListItemText primary="Reports" />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                  <LayersIcon />
                </ListItemIcon>
                <ListItemText primary="Integrations" />
              </ListItemButton>
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
            }}
          >
            <Toolbar />
            {showCustomers && <CustomersList handleShowLoan={handleShowLoan} />}
            {selectedCustomerId && showLoan && <Loan  customerId={selectedCustomerId} handleBack={handleShowLoan}  handleShowLoanDetail={handleShowLoanDetail}/>}
            {showReport && <Reports />}
            {showLoanDetail && <LoanDetail loanId={selectedLoanId}/>}

          </Box>
        </Box>
      </ThemeProvider>
    </MainCard>
  );
}
