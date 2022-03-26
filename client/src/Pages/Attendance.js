import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Switch from "react-switch";
import axios, { Axios } from "axios";
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';



function Attendance() {

  const[attendance,setAttendance]=React.useState([])
  const[dateVal,setDateVal]=React.useState("")
  const [viewer,setViewer]=React.useState(false)
  const [dateValues,setDateValues]=React.useState([])


  function handleDate(event){
      setDateVal(event.target.value)
  }

  function submitDate(){
    let test=dateVal.split('-').reverse().join('-')
    axios.get("http://localhost:4000/attendance/"+test).then(
        (res)=>{
          setDateValues(res.data[0].workers)
          setViewer(prevVal=>!prevVal)
        }
          
    )
  }

  function submitAttendance(){
    const d=new Date()
    const date=d.getDate()+"-"+"0"+String(+parseInt(d.getMonth())+1)+"-"+d.getFullYear()
    let data=[]
    for(let i=0;i<attendance.length;i++){
      data.push({
        name:attendance[i].fname + " " + attendance[i].lname,
        attendance:attendance[i].attendance
       }
      )
    }
    console.log(data)
    axios.post("http://localhost:4000/attendance/add/"+date,{
        attendance:data
    }).then(
      (res)=>{
        console.log(res)
      }
    )
  }

  React.useEffect(()=>{
      axios.get("http://localhost:4000/worker").then((res)=>{
        setAttendance(res.data)
      })}
  ,[0])
  
  function attendanceChanger(index){
    let data=JSON.parse(JSON.stringify(attendance))
    data[index].attendance=!data[index].attendance
    setAttendance(data)
  }
  
  function renderRows(){
    let res=[]
    for(let i=0;i<dateValues.length;i++){
        res.push(
          
          <StyledTableRow key={i}>
            <StyledTableCell>{i}</StyledTableCell>
            <StyledTableCell align="center">{dateValues[i].name}</StyledTableCell>
            <StyledTableCell align="center">{attendance[i].attendance?"Present":"Absent"}</StyledTableCell>
          </StyledTableRow>
        )

    }
    return res
  }


  function renderRow(){
    let res=[]
    for(let i=0;i<attendance.length;i++){
        res.push(
          
          <StyledTableRow key={i}>
            <StyledTableCell>{i}</StyledTableCell>
            <StyledTableCell align="center">{attendance[i].fname} {attendance[i].lname}</StyledTableCell>
            <StyledTableCell align="center"><Switch onChange={()=>attendanceChanger(i)} checked={attendance[i].attendance}/></StyledTableCell>
          </StyledTableRow>
        )

    }
    return res
  }
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));
  return (
    <Grid container spacing={2}>
      
      <Box m={10}>
      <Typography type="h4" variant="h6">
          Attendance Setter
      </Typography>
      <br/>
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1000,  }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell align="center">Name</StyledTableCell>
              <StyledTableCell align="center">Attendance&nbsp;</StyledTableCell>
              
            </TableRow>
          </TableHead>
          <TableBody>
              {renderRow()}
          </TableBody>
        </Table>
      </TableContainer>
      <br/>
      <br/>
      
    
      <Button variant="contained" onClick={submitAttendance}>Submit</Button>
      <br/>
      <br/>
      <br/>
        <hr/>
        <Typography type="h4" variant="h6">
          Attendance Checker
      </Typography>
      <br/>
          <input type="date" id="start" name="date" onChange={handleDate} value={dateVal} >

          </input>
          <br/><br/>
          <Button variant="contained" onClick={submitDate}>Submit</Button>
       

      </Box>
      {viewer && <Box m={10}>
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1000,  }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell align="center">Name</StyledTableCell>
              <StyledTableCell align="center">Attendance&nbsp;</StyledTableCell>
              
            </TableRow>
          </TableHead>
          <TableBody>
              {renderRows()}
          </TableBody>
        </Table>
      </TableContainer>
      
       

      </Box>}

    </Grid>
  )
}

export default Attendance