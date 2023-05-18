import { Calendar } from "@progress/kendo-react-dateinputs";
import { useState, useEffect } from "react";
import React from "react";
import {Link, useNavigate} from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import {useParams} from "react-router-dom";
import Navbar from "../Navbar";

import {
  Container,
  Calendardiv,
  Inputd,
  ContainerInput,
  TableI,
} from './TimesElement'

const PickDateOfTimes = props => {
  const { studio_id } = useParams();
  const [date, setDate] = useState(null);
  const [date2, setDate2] = useState(null);
  const [ times, settimes ] = useState(null);
  const [ idtimes, setidtimes ] = useState(null);


  const [params, setParams] = useState({page: 1, name: "", coach: "", date_from:"",  capacity:""});
  const [preps, setPreps] = useState({page: 1, name: "", coach: "",  date_from:"",  capacity:""});
  const [total, setTotal] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  function ChangeDateFormat(Date) {
    const array_D = Date.split(" ")
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const temp =  monthNames.indexOf(array_D[1]) + 1
    const changed = array_D[3] + '-' + temp + '-' + array_D[2];
    return changed
  }

  

  useEffect(() => {
    const { page, name, coach, date_from, date_end, capacity} = params;
    fetch(`http://127.0.0.1:8000/studios/class/times/filter/${studio_id}/?p=${page}&name=${name}&coach=${coach}&date_from=${date_from}&capacity=${capacity}`)
        .then(res => {
            const comp = parseInt(res.headers.get('count'));
            (comp % 5)===0 ? setTotal(Math.floor(comp / 5)) : setTotal(Math.floor(comp / 5) + 1);
            console.log(total);
            if (res.status !== 200 || comp === 0) setTotal(0);
            return res.json()
        }).then(json => {settimes(json);})
  }, [params]) 
 

 




  useEffect(() => {
    console.log(idtimes)
    if(idtimes !== undefined && idtimes !== null){
      try {
        fetch(
          "http://127.0.0.1:8000/studios/class/times/" + idtimes + "/enroll/", 
          {
            method: "GET",
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },      
          }
        ).then(res => {
            console.log(res.status)
            console.log(res)
            if(res.status === 401){
              navigate("/error_enroll")
            }
            else if(res.status === 200){
                navigate("/Profile")
            }


        });
      } catch {
        console.log("error", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }
  }, [idtimes])



  


  return (
    <Container className="Select_date">
        <Navbar/>
      <ContainerInput>
        <div>
        <Inputd>
        <p>Class Name</p>
        <TextField id="standard-basic" label="Class Name" variant="standard" 
              value={preps.name}
              onChange={(event) => {
                  setPreps({
                      ...preps,
                      name: event.target.value,
                      page: 1,
                  })
              }}
          />
          </Inputd>
          
          <Inputd>
          <p>Coach Name</p>
          <TextField id="standard-basic" label="Coach Name" variant="standard" 
          value={preps.coach}
          onChange={(event) => {
              setPreps({
                  ...preps,
                  coach: event.target.value,
                  page: 1,
              })
          }}/></Inputd>
        
        
          <Inputd>
          <p>Capacity</p>
          <TextField id="standard-basic" label="Capacity" variant="standard" 
              value={preps.capacity}
              onChange={(event) => {
                  setPreps({
                      ...preps,
                      capacity: event.target.value,
                      page: 1,
                  })
              }}/></Inputd>
    
    </div>
   
   
     

      <div>
        <Calendardiv>
          <div>
          <div>Select Start Date to see available times</div>
          <Calendar value={date} onChange={e =>{
            setDate(e.value)
            setPreps({
              ...preps,
              date_from:  ChangeDateFormat((e.value)?.toDateString()),
              page: 1,
            })
          }} />
          <div className="select_s">Selected date: {date?.toDateString()}</div>
          </div>
        </Calendardiv>
      
        <div className="Calendar">
        <Button  color="error"  variant="contained" component="label" onClick={(event) => {
                  setParams({
                      ...params,
                      name: preps.name,
                      coach: preps.coach,
                      date_from:preps.date_from,
                      capacity:preps.capacity,
                      page: 1,
                  })
              }}>Search!</Button>
        <Button  color="error"   variant="contained" component="label" onClick={(event) => {
                  setParams({
                      ...params,
                      name: "",
                      coach: "",
                      date_from:"",
                      capacity:"",
                      page: 1,
                  })
                  setDate(null)
                  setDate2(null)
              }}>Reset!</Button>
        </div>
      </div>
      </ContainerInput>
      <TableI>
      <div className="select_s">Capacity with 0 can not be enroll.</div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>id</TableCell>
              <TableCell align="right">name</TableCell>
              <TableCell align="right">coach</TableCell>
              <TableCell align="right">capacity</TableCell>
              <TableCell align="right">date_from</TableCell>
              <TableCell align="right">time from</TableCell>
              <TableCell align="right">time end</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {times?.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="right">{row['studio_class'].name}</TableCell>
                <TableCell align="right">{row['studio_class'].coach}</TableCell>
                <TableCell align="right">{row.capacity}</TableCell>
                <TableCell align="right">{(row.date_from).substring(0, 10)}</TableCell>
                <TableCell align="right">{(row.date_from).substring(11, 19)}</TableCell>
                <TableCell align="right">{(row.date_end).substring(11, 19)}</TableCell>
                
                <Button   color="error" variant="outlined" onClick={() =>{setidtimes(row.id)}}>enroll</Button>
              </TableRow>

            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <table>
      <Button  color="error"   variant="contained" component="label" onClick={() => setParams({
                  ...params,
                  page: Math.max(1, params.page - 1)
              })} disabled={ params.page === 1 }>
                  prev
                  </Button>
              <>{ params.page }</>
              <Button  color="error"   variant="contained" component="label" onClick={() => setParams({
                  ...params,
                  page: Math.min(total, params.page + 1)
              })} disabled={ params.page === total || total === 1 || total === 0 }>
                  next
                  </Button>
        
      </table>
      </TableI>
    </Container>


  );
  
};


export default PickDateOfTimes;