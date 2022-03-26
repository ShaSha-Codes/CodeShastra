import React from 'react'
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import axios from "axios"
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Webcam from "react-webcam";


function WorkerManager() {
    const[workerData,setWorkerData]=React.useState([])
    const[form,setForm]=React.useState(0)
    const [regWorkerData,setRegWorkerData]=React.useState({})
    const[imageSrc,setImageSrc]=React.useState("")
    const webRef=React.useRef(null)



    function handleData(event){
        setRegWorkerData((prevData)=>{
            return {...prevData,[event.target.name]:event.target.value}
        })
    }


    function submitWorkerData(){

            axios({
                method: "POST",
                data: {
                    fname: regWorkerData.fname,
                    lname: regWorkerData.lname,
                    gender: regWorkerData.gender,
                    age: regWorkerData.age,
                    address: regWorkerData.address,
                    aadhar:regWorkerData.aadhar,
                    image:imageSrc
                },
                withCredentials: true,
                url: "http://localhost:4000/worker/add",
            }).then((res) => console.log(res));
    
    }

    const showImage=()=>{
        setImageSrc(webRef.current.getScreenshot())
    }
    console.log(imageSrc)
    React.useEffect(async ()=>{
        refreshWorkerData()
    },[0])

    async function refreshWorkerData(){
        await axios.get('http://localhost:4000/worker')
        .then(res=>{
            setWorkerData(res.data)
        })
    }

    console.log(workerData)

    async function handleDelete(fname){
        console.log(fname)
        await axios.delete('http://localhost:4000/worker/delete/'+fname)
        .then(res=>{
            console.log(res)
        })
        .catch(err=>{
            console.log(err)
        })
        refreshWorkerData()
        console.log("Testing")
    }


    function renderRows(){
        let res=[]
        for(let i=0;i<workerData.length;i++){

            res.push(
                <TableRow key={i}>
                        <TableCell><img style={{borderRadius:"1px",width:"150px"}} src={workerData[i].image}/></TableCell>
                        <TableCell>{workerData[i].fname}</TableCell>
                        <TableCell>{workerData[i].lname}</TableCell>
                        <TableCell>{workerData[i].gender}</TableCell>
                        <TableCell>{workerData[i].age}</TableCell>
                        <TableCell>{workerData[i].address}</TableCell>
                        <TableCell >
                            <Box spacing={3}>
                                <Button variant="contained" color="success">
                                    Edit
                                </Button>
                                <Button onClick={()=>handleDelete(workerData[i].fname)} variant="contained" color="error">
                                    Delete
                                </Button>
                            </Box>
                        </TableCell>
                    </TableRow>
            )
        }
        return res
        
           
    }
  return (
    <Box>
        <Button onClick={()=>{
            setForm((prevValue)=>{return prevValue?0:1})
        }} variant="contained" color="success">
            Add
        </Button>
        {form &&
        <Box className=" Register"  p={3} sx={{width:"30%", border:1, borderRadius:1}}>
          <Stack p={1} spacing={3}>
            <Typography m={1} sx={{textAlign:"center"}} variant="h4">Register</Typography>
            <Webcam ref={webRef}/>
                <Button onClick={showImage} variant="contained" color="primary">
                    Click Here
                </Button>
            <img  src={imageSrc}/>
            <Box>
                
                    <TextField
                        required
                        id="outlined-required"
                        label="First Name"
                        name="fname"
                        value={regWorkerData.fname} onChange={handleData}
                        p={3}
                        sx={{width:"43%"}}
                    />
                    &nbsp;&nbsp;&nbsp;
                    <TextField
                        required
                        id="outlined-required"
                        label="Last Name"
                        name="lname"
                        value={regWorkerData.lname} onChange={handleData}
                        sx={{width:"50%"}}
                    />
            </Box>
                
                <TextField
                    required
                    id="outlined-required"
                    label="Gender"
                    name="gender"
                    type="gender"
                    sx={{width:"50%"}}
                    value={regWorkerData.gender} onChange={handleData}
                
                />
                <TextField
                    required
                    id="outlined-required"
                    label="Age"
                    name="age"
                    type="number"
                    sx={{width:"50%"}}
                    value={regWorkerData.age} onChange={handleData}
                    
                />
                <TextField
                    required
                    id="outlined-required"
                    label="Address"
                    name="address"
                    type="text"
                    sx={{width:"80%"}}
                    value={regWorkerData.address} onChange={handleData}
                    
                />
                <TextField
                    required
                    id="outlined-required"
                    label="Aadhar"
                    name="aadhar"
                    type="text"
                    sx={{width:"80%"}}
                    value={regWorkerData.aadhar} onChange={handleData}
                    
                />

                <Box sx={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                <Button sx={{width:"50%"}}variant="contained" size="large" onClick={submitWorkerData} >
                    Register
                </Button>
                </Box>
            </Stack>
        </Box>
}
        <Box m={5}>
            <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell>First Name</TableCell>
                        <TableCell>Last Name</TableCell>
                        <TableCell>Gender</TableCell>
                        <TableCell>Age</TableCell>
                        <TableCell>Address</TableCell>
                        <TableCell>Options</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {renderRows()}
                </TableBody>
                </Table>
            </TableContainer>
        </Box>
        
    </Box>
  )
}

export default WorkerManager