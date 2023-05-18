import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import Maps from "../Globalcomponents/Maps";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import {
    ContainerTable,
    Inputd,
    ContainerInput,
    TableI
  } from './StudioElement'
import Navbar from "../Navbar";

const Studios = () => {
    const [studios, setStudios] = useState(null);
    const [params, setParams] = useState({page: 1, name: "", coach: "", amenity: "", quantity: "", lat: "", lng: ""});
    const [preps, setPreps] = useState({page: 1, name: "", coach: "", amenity: "", quantity: "", lat: "", lng: ""});
    const [total, setTotal] = useState(1);

    let navigate = useNavigate();
    function routeChange(id) {
        let path = `../studio/` + id;
        navigate(path);
    }

    useEffect(() => {
        const { page, name, coach, amenity, quantity, lat, lng } = params;
        fetch(`http://127.0.0.1:8000/studios/list/?p=${page}&name=${name}&coach=${coach}&amenity=${amenity}&quantity=${quantity}&lat=${lat}&lng=${lng}`)
            .then(res => {
                const comp = parseInt(res.headers.get('count'));
                (comp % 5)===0 ? setTotal(Math.floor(comp / 5)) : setTotal(Math.floor(comp / 5) + 1);
                if (res.status !== 200 || comp === 0) setTotal(0);
                return res.json()
            }).then(json => {setStudios(json);})
    }, [params])

  return (

    <ContainerTable>
        <Navbar />
    <ContainerInput>
    <Inputd>
    
      <TextField id="standard-basic" label="Studio Name" variant="standard" 
         
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
  
      <TextField id="standard-basic" label="Coach Name" variant="standard" 
            style={{width: 100, height: 20, fontSize: 18, margin: 4}}
            value={preps.coach}
            onChange={(event) => {
                setPreps({
                    ...preps,
                    coach: event.target.value,
                    page: 1,
                })
            }}
         />
         </Inputd>
         <Inputd>

      <TextField id="standard-basic" label="Amenity" variant="standard" 
    
            value={preps.amenity}
            onChange={(event) => {
                setPreps({
                    ...preps,
                    amenity: event.target.value,
                    page: 1,
                })
            }}
         />
         </Inputd>
         <Inputd>
     
      <TextField id="standard-basic" label="quantity" variant="standard" 
            style={{width: 100, height: 20, fontSize: 18, margin: 4}}
            value={preps.quantity}
            onChange={(event) => {
                setPreps({
                    ...preps,
                    quantity: event.target.value,
                    page: 1,
                })
            }}
         />
         </Inputd>
         <Inputd>

      <TextField id="standard-basic" label="Latitude" variant="standard" 
            style={{width: 100, height: 20, fontSize: 18, margin: 4}}
            value={preps.lat}
            onChange={(event) => {
                setPreps({
                    ...preps,
                    lat: event.target.value,
                    page: 1,
                })
            }}
         />
         </Inputd>
         <Inputd>

      <TextField id="standard-basic" label="Longitude" variant="standard" 
            style={{width: 100, height: 20, fontSize: 18, margin: 4}}
            value={preps.lng}
            onChange={(event) => {
                setPreps({
                    ...preps,
                    lng: event.target.value,
                    page: 1,
                })
            }}
         />
         </Inputd>
         <Button  color="error"   variant="contained" component="label" onClick={(event) => {
                setParams({
                    ...params,
                    name: preps.name,
                    coach: preps.coach,
                    amenity: preps.amenity,
                    quantity: preps.quantity,
                    lat: preps.lat,
                    lng: preps.lng,
                    page: 1,
                })
            }}>Search!</Button>
        </ContainerInput>
        <TableI>
         
          <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>id</TableCell>
              <TableCell align="right">name</TableCell>
              <TableCell align="right">address</TableCell>
              <TableCell align="right">Postal Code</TableCell>
              <TableCell align="right">Details Page</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {studios?.map((studio) => (
                <TableRow
                key={studio.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                    <TableCell component="th" scope="row">
                  {studio.id}
                </TableCell>
                <TableCell align="right">{studio.name}</TableCell>
                <TableCell align="right">{studio.address}</TableCell>
                <TableCell align="right">{studio.postal_code }</TableCell>
                <TableCell align="right">{studio.postal_code}</TableCell>
                <TableCell align="right"><Button   color="error" variant="outlined"  onClick={() => routeChange( studio.id )}>
                        See Details
                        </Button></TableCell>
                
               
                  
                  
                </TableRow>
            ))}
            </TableBody>
            </Table>
        </TableContainer>
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
                  <div  style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
                    <Maps />
                </div>
        </TableI>
        </ContainerTable>
    );
}

export default Studios;
// comment