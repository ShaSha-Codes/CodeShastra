import React from "react"
import axios from "axios"
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Grid";
import { ReactSession } from 'react-client-session';
import { useNavigate } from 'react-router';

function Landing() {
    ReactSession.setStoreType("sessionStorage");



    console.log('reload');
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: "center",
        color: theme.palette.text.secondary,
      }));

    const[regIsTrue, setRegIsTrue] = React.useState(false);
    const[logIsTrue, setLogIsTrue] = React.useState(true);


    const [regData,setRegData]=React.useState({
      fname:"",
      lname:"",
      email:"",
      password:"",
      cpassword:""
    })
  
    const [logData,setLogData]=React.useState({
      email:"",
      password:""
    })
  
    
    function handleRegData(event){
      setRegData((prevData)=>{
        return {...prevData,[event.target.name]:event.target.value}
      })
      event.preventDefault();
    }
  
    function handleLoginData(event){
      setLogData((prevData)=>{
        return {...prevData,[event.target.name]:event.target.value}
      })
       event.preventDefault();
    }

    function register(){
        setLogIsTrue(false);
        setRegIsTrue(true);
    }

    function login(){
        setRegIsTrue(false);
        setLogIsTrue(true);
    }
    let navigate = useNavigate();
    async function sendLoginData(){
      
      axios({
        method: "POST",
        data: {
          username: logData.email,
          password: logData.password,
        },
        withCredentials: true,
        url: "http://localhost:4000/contractor/login",
      }).then((res) =>{ 
        console.log("Testing")
        ReactSession.set("user", res)
        navigate('/dashboard')
      });
    }
  
    function sendRegData(){
      let res=regData
      axios.post("http://localhost:4000/contractor/register",res).then((res)=>{
        console.log(res)
      }).catch(err=>{
        console.log(err)
      })
    }
  
    // function getData(){
    //   axios.get("http://localhost:4000/user/test").then((res)=>{
    //     console.log(res.data)
    //   }).catch((err)=>{
    //     console.log(err)
    //   })
    // }
  
    return (
      
      <div className="Landing">

    <Grid
        container
        sx={{ minHeight: "100vh", paddingBottom: "4%" }}
        className="main"
      >
        <Grid item xs={12} md={6}>
          <Item
            disabled
            sx={{
              border: 0,
              boxShadow: 0,
              marginTop: "28%",
              backgroundColor: "transparent",
             
            }}
            className="indexpart1"
          >
            <h1>SafetyFirst</h1>
            <h2 sx={{ color: "#fff" }}>Manage a Safe Workspace</h2>
          </Item>
        </Grid>
       
     <Grid item xs={12} md={6} sx={{ padding: 0 }}>
          <Box
            sx={{
              border: 0,
              boxShadow: 0,
              backgroundColor: "transparent",
              padding: 0,
              marginTop: "15%",
            }}
            className="indexpart2"
          >
        <div className="formPart">
          { regIsTrue && 
          <Box className="Register"  p={2} sx={{width:"90%"}}>
          <Stack p={1} spacing={3}>
            <Typography m={1} sx={{textAlign:"center", fontFamily:"'Inter', sans-serif"}} variant="h4">Register</Typography>
            <Box>
              <div className="inline">
                <TextField
                    required
                    id="outlined-required"
                    label="First Name"
                    name="fname"
                    value={regData.fname} onChange={handleRegData}
                    p={3}
                    sx={{width:"49%"}}
                  />
                 
                  <TextField
                    required
                    id="outlined-required"
                    label="Last Name"
                    name="lname"
                    value={regData.lname} onChange={handleRegData}
                    sx={{width:"49%"}}
                  />
                  </div>
            </Box>
              
              <TextField
                required
                id="outlined-required"
                label="Email"
                name="email"
                type="email"
                value={regData.email} onChange={handleRegData}
              
              />
              <TextField
                required
                id="outlined-required"
                label="Password"
                name="password"
                type="password"
                value={regData.password} onChange={handleRegData}
               
              />
              <TextField
                required
                id="outlined-required"
                label="Confirm Password"
                name="cpassword"
                type="password"
                value={regData.cpassword} onChange={handleRegData}
                
              />
            <Box sx={{display:'flex',justifyContent:'center',alignItems:'center'}}>
              <Button sx={{width:"49%"}}variant="contained" size="large" onClick={sendRegData}>
                Register
              </Button>
            </Box>
            <h4 style={{textAlign:"center"}}>
                Existing User?
                <Button variant="text" onClick={login}>Login</Button>
             </h4>
          </Stack>
        </Box>}
  
        {logIsTrue && 
        <Box className="Login"  mt={3} p={2} sx={{width:"95%"}}>
          <Stack p={1} spacing={3}>
            <Typography m={1} sx={{textAlign:"center"}} variant="h4">Login</Typography>
  
              <TextField
                required
                id="outlined-required"
                label="Email"
                name="email"
                type="email"
                value={logData.email} 
                onChange={handleLoginData}
              
              />
              <TextField
                required
                id="outlined-required"
                label="Password"
                name="password"
                type="password"
                value={logData.password} 
                onChange={handleLoginData}
               
              />
            <Box sx={{display:'flex',justifyContent:'center',alignItems:'center'}}>
              <Button sx={{width:"49%"}}variant="contained" size="large" onClick={sendLoginData}>
                Login
              </Button>
              </Box>
           
              <h4 style={{textAlign:"center"}}>
                New User?
                <Button variant="text" onClick={register}>Register</Button>
             </h4>
            
            
          </Stack>
       
        </Box>}
        </div>
        </Box>
          </Grid>
          </Grid>
      
        
        {/* <button onClick={getData}>
          Click Here
        </button> */}
      </div>
    );
  }
  
  export default Landing;