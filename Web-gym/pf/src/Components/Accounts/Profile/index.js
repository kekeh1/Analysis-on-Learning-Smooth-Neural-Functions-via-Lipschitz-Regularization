import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Input, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import {Card} from '@mui/material';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { Fragment } from 'react';
import { useEffect, useState } from 'react';
import Navbar from '../../Navbar';
import { spacing } from '@mui/system';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ArticleIcon from '@mui/icons-material/Article';
import LastPageIcon from '@mui/icons-material/LastPage';
import Select from '@mui/material/Select';
import { MembershipsH1 } from '../../Memberships/MembershipsElements';
import {navigate} from "@progress/kendo-react-buttons/dist/es/ListButton/utils/navigation";

function LinkTab(props) {
  return (
    <Tab
      component="a"
      onClick={(event) => {
        event.preventDefault();
      }}
      {...props}
    />
  );
}

export default function ProfilePage() {
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [cancel_open, setCancelOpen] = React.useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [profile, setProfile] = useState([]);
  const [data, setData] = useState([]);

  const [email, setEmail] = useState("")
  const [first_name, setFirstName] = useState("")
  const [last_name, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [avatar, setAvatar] = useState(null)
  const [card_info, setCardInfo] = useState("")
  const [billing_card, setBillingCard] = useState("")
  const [message, setMessage] = React.useState("");

  const [total, setTotal] = useState(1);
  const [payment_history, setPaymentHistory] = useState(null);
  const [payment_rows, setPaymentRows] = useState(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [curr_subscription_recur, SetCurrSubscriptionRecur] = useState(null)

  const [subscription, setSubscription] = React.useState(null);
  const [temp_subscription, setTempSubscription] = React.useState("");

  const [sub_data, setSubData] = useState([]);

  const [recordHistory, setRecordHistory] = useState(null);
  const [recordUpcoming, setRecordUpcoming] = useState(null);
  const [dropClass, setDropClass] = useState(null);

    useEffect(() => {
        const getSubscriptions = async () => {
              let response = await fetch('http://127.0.0.1:8000/accounts/subscriptions/', {
                  method: "GET",
              })
              let data = await response.json()
              setSubData(data.results)
        }
        getSubscriptions();
    }, [subscription])

    useEffect(() => {
        const getRecords = async () => {
              fetch('http://127.0.0.1:8000/accounts/time/upcoming/', {
                  method: "GET",
                  headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
              }).then(res => res.json()).then(json => {setRecordUpcoming(json)})

             fetch('http://127.0.0.1:8000/accounts/time/history/', {
                  method: "GET",
                  headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
              }).then(res => res.json()).then(json => {setRecordHistory(json)})
        }
        getRecords();
    }, [subscription])

  useEffect(() => {
    if(dropClass !== undefined && dropClass !== null){
        fetch("http://127.0.0.1:8000/studios/class/times/" + dropClass + "/drop/",
          { method: "GET",
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,},}
        ).then(res => {
          if(res.status === 401){ navigate("/error_enroll") }
          else if(res.status === 200){ navigate("/profile") }
        });
    }
  }, [dropClass])


  useEffect(() => {
    const getProfiles = async () => {
          let response = await fetch('http://127.0.0.1:8000/accounts/profile/', {
              method: "GET",
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          })
          let data = await response.json()
          let subscription = data.subscription
          setSubscription(subscription)
          setData(data)
    }
     getProfiles();
  }, [profile, billing_card])
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCancelClickOpen = () => {
    setCancelOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setMessage()
  };

  const handleCancelClose = () => {
    setCancelOpen(false);
    setMessage()
  };

  useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      setIsAuth(true);
    }
  }, []);


function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;
  
    const handleFirstPageButtonClick = (event) => {
      onPageChange(event, 0);
    };
  
    const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
    };
  
    const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);
    };
  
    const handleLastPageButtonClick = (event) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
  
    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
    );
  }
  
  TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
  };
  

function createData(id, amount, date, card_info, recurrence) {
  if (id === 0) {
    id = "Next Future Payment"
    SetCurrSubscriptionRecur(recurrence)
  }

  return {
    id,
    amount,
    date,
    card_info,
    recurrence,
  };
}

const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - payment_rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

useEffect(() => {
  const getPaymentHistory = async () => {
        let response = await fetch('http://127.0.0.1:8000/accounts/payment_history/', {
            method: "GET",
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        })
        let payment_history = await response.json()
        console.log(payment_history)
        setPaymentHistory(payment_history)
        setPaymentRows(null)
        let rows = []
        for (let transaction = 0; transaction < payment_history.length; transaction++) {
          rows.push(createData(payment_history[transaction].id, 
                               payment_history[transaction].amount, 
                               payment_history[transaction].date, 
                               payment_history[transaction].card_info,
                               payment_history[transaction].recurrence))
        }
        setPaymentRows(rows);
        console.log(payment_rows)

  }
   getPaymentHistory();
}, [billing_card])



  const success = async (text)=> {
    handleClose()
  }; 

  const success_cancel = async (text)=> {
    handleCancelClose()
  }; 

  const update_profile_api = async (email, first_name, last_name, phone, avatar, success, fail) => {
    var data = new FormData();

    if (email !== "") {
      data.append("email", email)
    }
    if (first_name !== "") {
      data.append("first_name", first_name)
    }
    if (last_name !== "") {
      data.append("last_name", last_name);
    }
    if (phone !== "") {
      data.append("phone", phone)
    } 
    if (avatar !== null) {
      data.append("avatar", avatar, avatar.name)
    }

    for (var key of data.entries()) {
      console.log(key[0] + ', ' + key[1]);
    }

    const response = await fetch(
          "http://127.0.0.1:8000/accounts/update_profile/",
          {
              method: 'PATCH',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
              body: data
          }
      );
    const text = await response.text();
    if (response.status === 200) {
      setProfile(new Date)
      success(JSON.parse(text));
    } else {
      console.log("fail", text);
      Object.entries(JSON.parse(text)).forEach(([key, value])=>{
        fail(`${key}: ${value}`);
      });
    }
};

const tryUpdateProfile = async (e) => {
    e.preventDefault();
    console.log("Updating profile");
    await update_profile_api(email, first_name, last_name, phone, avatar, success, (text)=>{setMessage(text)});
};

const update_card_info_api = async (card_info, success, fail) => {

  const response = await fetch(
        "http://127.0.0.1:8000/accounts/update_card_info/",
        {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              "card_info": card_info
            })
        }
    );
  const text = await response.text();
  if (response.status === 200) {
    setBillingCard(new Date)
    success(JSON.parse(text));
  } else {
    console.log("fail", text);
    Object.entries(JSON.parse(text)).forEach(([key, value])=>{
      fail(`${key}: ${value}`);
    });
  }
};

const tryUpdateCardInfo = async (e) => {
  e.preventDefault();
  console.log("Updating card information");
  await update_card_info_api(card_info, success, (text)=>{setMessage(text)});
};

const add_subscription_api = async (subscription, card_info, success, fail) => {

  const response = await fetch(
        "http://127.0.0.1:8000/accounts/add_subscription/",
        {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              "subscription": temp_subscription,
              "card_info": card_info
            })
        }
    );
  const text = await response.text();
  if (response.status === 200) {
    setBillingCard(new Date)
    setProfile(new Date)
    success(JSON.parse(text));
  } else {
    console.log("fail", text);
    Object.entries(JSON.parse(text)).forEach(([key, value])=>{
      fail(`${key}: ${value}`);
    });
  }
};

const tryAddSubscription = async (e) => {
  e.preventDefault();
  console.log("Adding subscription");
  await add_subscription_api(temp_subscription, card_info, success, (text)=>{setMessage(text)});
};


const update_subscription_api = async (subscription, success, fail) => {

  const response = await fetch(
        "http://127.0.0.1:8000/accounts/update_subscription/",
        {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              "subscription": temp_subscription
            })
        }
    );
  const text = await response.text();
  if (response.status === 200) {
    setBillingCard(new Date)
    setProfile(new Date)
    success(JSON.parse(text));
  } else {
    console.log("fail", text);
    Object.entries(JSON.parse(text)).forEach(([key, value])=>{
      fail(`${key}: ${value}`);
    });
  }
};

const tryUpdateSubscription = async (e) => {
  e.preventDefault();
  console.log("Updating subscription");
  await update_subscription_api(temp_subscription, success, (text)=>{setMessage(text)});
};


const cancel_subscription_api = async (success, fail) => {

  const response = await fetch(
        "http://127.0.0.1:8000/accounts/cancel_subscription/",
        {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              "confirm": "confirm"
            })
        }
    );
  const text = await response.text();
  if (response.status === 200) {
    setBillingCard(new Date)
    setProfile(new Date)
    success_cancel(JSON.parse(text));
  } else {
    console.log("fail", text);
    Object.entries(JSON.parse(text)).forEach(([key, value])=>{
      fail(`${key}: ${value}`);
    });
  }
};

const tryCancelSubscription = async (e) => {
  e.preventDefault();
  console.log("Canceling subscription");
  await cancel_subscription_api(success_cancel, (text)=>{setMessage(text)});
};



var all_subs_dropdown = sub_data.map(item => <MenuItem value={item.name}>{item.name} - ${item.amount}</MenuItem>)

  return (
    <>
      <Box bgcolor="white" sx={{ width: '100%', height: '110vh'}}>
      <Navbar />
        {isAuth === true ? (
        <Fragment>
        <Tabs sx={{m: 10}} value={value} onChange={handleChange} aria-label="nav tabs example">
          <Tab icon={<AccountCircleIcon />} label="Overview" />
          <Tab icon={<CreditCardIcon />} label="Billing" />
          <Tab icon={<FitnessCenterIcon />} label="Subscription" />
          <Tab icon={<ArticleIcon />} label="Records" />
        </Tabs>
        <Box>
            {value === 0 && (
              <Box>
              <Card sx={{ minHeight: 350, maxWidth: 800, m:10 }}>
                  <CardActionArea>
                      <CardMedia
                      component="img"
                      height="300"
                      image={"http://127.0.0.1:8000" + data.avatar}
                      alt="avatar"
                      />
                      <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                          {data.first_name + " " + data.last_name}
                      </Typography>
                      <Typography variant="body2" color="text.primary">
                          <b>First Name:</b> {data.first_name}
                      </Typography>
                      <Typography variant="body2" color="text.primary">
                      <b>Last Name:</b> {data.last_name}
                      </Typography>
                      <Typography variant="body2" color="text.primary">
                      <b>Email:</b> {data.email}
                      </Typography>
                      <Typography variant="body2" color="text.primary">
                      <b>Phone Number:</b> {data.phone}
                      </Typography>
                      </CardContent>
                  </CardActionArea>
                  <CardActions>
                      <Button onClick={handleClickOpen} size="small" color="primary">
                      Edit
                      </Button>
                      <Dialog open={open} onClose={handleClose}>
                      <DialogTitle>Edit Profile</DialogTitle>
                      <DialogContent>
                      <DialogContentText>
                          Please enter the details that you would like to edit.
                      </DialogContentText>
                      <TextField
                          autoFocus
                          margin="dense"
                          id="email"
                          label="Email Address"
                          type="email"
                          fullWidth
                          variant="standard"
                          onChange={(e)=>{setEmail(e.target.value)}}
                      />
                      <TextField
                          autoFocus
                          margin="dense"
                          id="first_name"
                          label="First Name"
                          type="text"
                          fullWidth
                          variant="standard"
                          onChange={(e)=>{setFirstName(e.target.value)}}
                      />
                      <TextField
                          autoFocus
                          margin="dense"
                          id="last_name"
                          label="Last Name"
                          type="text"
                          fullWidth
                          variant="standard"
                          onChange={(e)=>{setLastName(e.target.value)}}
                      />
                      <TextField
                          autoFocus
                          margin="dense"
                          id="phone"
                          label="Phone Number"
                          type="text"
                          fullWidth
                          variant="standard"
                          onChange={(e)=>{setPhone(e.target.value)}}
                      />
                      <Input
                          autoFocus
                          margin="dense"
                          id="avatar"
                          label="Avatar"
                          type="file"
                          fullWidth
                          variant="standard"
                          onChange={(e)=>{setAvatar(e.target.files[0])}}
                      />
                      <div style={{margin: "1em", color: "red"}}>{message}</div>
                      </DialogContent>
                      <DialogActions>
                      <Button onClick={handleClose}>Cancel</Button>
                      <Button onClick={tryUpdateProfile}>Save</Button>
                      </DialogActions>
                  </Dialog>
                  </CardActions>
              </Card>
              </Box>
            )}
            {value === 1 && (
              <Box>
                <Card sx={{ maxWidth: 350, m:10 }}>
                    <CardActionArea>
                        <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Credit Card Information
                        </Typography>
                        <Typography variant="body2" color="text.primary">
                        <b>Credit Card Number:</b> {data.card_info}
                      </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <Button onClick={handleClickOpen} size="small" color="primary">
                        Edit
                        </Button>
                        <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>Edit Card Information</DialogTitle>
                        <DialogContent>
                        <DialogContentText>
                            Please enter a 16 digit card number.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="card_info"
                            label="Card Information"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={(e)=>{setCardInfo(e.target.value)}}
                        />
                        <div style={{margin: "1em", color: "red"}}>{message}</div>
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={tryUpdateCardInfo}>Save</Button>
                        </DialogActions>
                    </Dialog>
                    </CardActions>
                </Card>
                <h1>Payment History</h1>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell><b>Transaction ID</b></TableCell>
                        <TableCell align="right"><b>Date</b></TableCell>
                        <TableCell align="right"><b>Amount</b></TableCell>
                        <TableCell align="right"><b>Card Information</b></TableCell>
                        <TableCell align="right"><b>Recurrence</b></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                    {(rowsPerPage > 0
                        ? payment_rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : payment_rows
                         ).map((row) => (
                        <TableRow
                          key={row.id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">
                            {row.id}
                          </TableCell>
                          <TableCell align="right">{row.date}</TableCell>
                          <TableCell align="right">{row.amount}</TableCell>
                          <TableCell align="right">{row.card_info}</TableCell>
                          <TableCell align="right">{row.recurrence}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>

                    <TableFooter>
                      <TableRow>
                        <TablePagination
                          rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                          colSpan={3}
                          count={payment_rows.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          SelectProps={{
                            inputProps: {
                              'aria-label': 'rows per page',
                            },
                            native: true,
                          }}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                          ActionsComponent={TablePaginationActions}
                        />
                      </TableRow>
                    </TableFooter>
                  </Table>
                </TableContainer>
              </Box>
            )}
            {value === 2 && (
              <Box>
                {subscription === null ? (
                  <Fragment>
                  <Card sx={{ maxWidth: 500, m:10 }}>
                    <CardActionArea>
                        <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Subscription Information
                        </Typography>
                        <Typography variant="body2" color="text.primary">
                          <b> Active Subscription: </b> None
                      </Typography>
                      <Typography variant="body2" color="text.primary">
                          <b> Expires on: </b> {data.next_payment_date}
                      </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <Button onClick={handleClickOpen} size="small" color="primary">
                        Add
                        </Button>
                        <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>Add Subscription</DialogTitle>
                        <DialogContent>
                        <DialogContentText>
                            Please select your desired subscription plan.
                        </DialogContentText>
                        <InputLabel id="demo-simple-select-label">Subscription</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={temp_subscription}
                          label="Subscription"
                          onChange={(e)=>{setTempSubscription(e.target.value)}}
                        >
                          {all_subs_dropdown}
                        </Select>
                        <br></br>
                        <br></br>
                        Please confirm your credit card information.
                        <TextField
                            autoFocus
                            margin="dense"
                            id="card_info"
                            label="Card Information"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={(e)=>{setCardInfo(e.target.value)}}
                        />
                        <div style={{margin: "1em", color: "red"}}>{message}</div>
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={tryAddSubscription}>Subscribe</Button>
                        </DialogActions>
                    </Dialog>
                    </CardActions>
                </Card>
                  </Fragment>
                ) : (
                  <Fragment>
                  <Card sx={{ maxWidth: 500, m:10 }}>
                    <CardActionArea>
                        <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Subscription Information
                        </Typography>
                        <Typography variant="body2" color="text.primary">
                          <b>Active Subscription:</b> {curr_subscription_recur}
                      </Typography>
                      <Typography variant="body2" color="text.primary">
                          <b>Next Payment Date on:</b> {data.next_payment_date}
                      </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <Button onClick={handleClickOpen} size="small" color="primary">
                        Edit
                        </Button>
                        <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>Edit Subscription</DialogTitle>
                        <DialogContent>
                        <DialogContentText>
                            Please select your desired subscription.
                        </DialogContentText>
                        <InputLabel id="demo-simple-select-label">Subscription</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={temp_subscription}
                          label="Subscription"
                          onChange={(e)=>{setTempSubscription(e.target.value)}}
                        >
                          {all_subs_dropdown}
                        </Select>
                        <div style={{margin: "1em", color: "red"}}>{message}</div>
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={tryUpdateSubscription}>Save</Button>
                        </DialogActions>
                    </Dialog>
                    <Button onClick={handleCancelClickOpen} size="small" color="primary">
                        Cancel
                      </Button>
                      <Dialog open={cancel_open} onClose={handleCancelClose}>
                        <DialogTitle>Cancel Subscription</DialogTitle>
                        <DialogContent>
                        <DialogContentText>
                            Are you sure you want to cancel your current subscription plan? You may use your subscription until the end of your billing period.
                        </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={handleCancelClose}>No</Button>
                        <Button onClick={tryCancelSubscription}>Yes</Button>
                        </DialogActions>
                    </Dialog>
                    </CardActions>
                </Card>
                  </Fragment>
                )}
              </Box>
            )}
            {value === 3 && (
              <Box>
                  <h1>Oncoming Schedules</h1>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Class Number</TableCell>
                        <TableCell align="center">Start Time</TableCell>
                        <TableCell align="center">End Time</TableCell>
                        <TableCell align="center">Drop Class</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                    {(rowsPerPage > 0
                        ?recordUpcoming.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : recordUpcoming
                         ).map((row) => (
                        <TableRow
                          key={row.id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row" align="center">
                            {row.studio_class_id}
                          </TableCell>
                          <TableCell align="center">{row.date_from}</TableCell>
                          <TableCell align="center">{row.date_end}</TableCell>
                          <TableCell align="center"><Button onClick={() => {
                              setDropClass(row.id)
                              window.location.reload(false)
                          }}
                          >Drop</Button></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>

                    <TableFooter>
                      <TableRow>
                        <TablePagination
                          rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                          colSpan={4}
                          count={recordUpcoming.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          SelectProps={{
                            inputProps: {
                              'aria-label': 'rows per page',
                            },
                            native: true,
                          }}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                          ActionsComponent={TablePaginationActions}
                        />
                      </TableRow>
                    </TableFooter>
                  </Table>
                </TableContainer>
                <br/><h1>Past Records</h1>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Class Number</TableCell>
                        <TableCell align="center">Start Time</TableCell>
                        <TableCell align="center">End Time</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                    {(rowsPerPage > 0
                        ?recordHistory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : recordHistory
                         ).map((row) => (
                        <TableRow
                          key={row.id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row" align="center">
                            {row.studio_class_id}
                          </TableCell>
                          <TableCell align="center">{row.date_from}</TableCell>
                          <TableCell align="center">{row.date_end}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>

                    <TableFooter>
                      <TableRow>
                        <TablePagination
                          rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                          colSpan={3}
                          count={recordHistory.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          SelectProps={{
                            inputProps: {
                              'aria-label': 'rows per page',
                            },
                            native: true,
                          }}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                          ActionsComponent={TablePaginationActions}
                        />
                      </TableRow>
                    </TableFooter>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>
        </Fragment>
        ) : (
        <Fragment>
            <div>You are not logged in!</div>
        </Fragment>
        )}
      </Box>
    </>

  );
}