import React from "react";
import TextField from '@mui/material/TextField';
import Stack from "@mui/material/Stack";
import Button from '@mui/material/Button';
import axios from "axios"
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router';

export default function Location(){
    
    const [longitude, setLongitude] = React.useState(0);
    const [latitude, setLatitude] = React.useState(0);
   const [mypos, setMyPos] = React.useState(undefined);
   const [visible, setVisible] = React.useState(false);
   const [locationData,setLocationData]=React.useState([])

   let navigate = useNavigate();
   React.useEffect(getLocations,[0])

   async function getLocations(){
    await axios.get("http://localhost:4000/location/").then((res)=>{
           setLocationData(res.data)
    })
}

   function mapblocks(){
       let res=[]
         for(let i=0;i<locationData.length;i++){
             res.push(
                <Box m={5} onClick={()=>navigate('/workermanager')}>
                    <Paper sx={{length:"250px",width:"250px"}}elevation={12}>
                        <img style={{width:"250px"}} src={locationData[i].img}/>
                        <Typography sx={{marginLeft:"10px"}} variant="h6" component="div" gutterBottom>
                            Longitude : {locationData[i].long}
                        </Typography>
                        <Typography sx={{marginLeft:"10px"}}  variant="h6" component="div" gutterBottom>
                            Latitude : {locationData[i].lati}
                        </Typography>

                    </Paper>
                 </Box>
             )
             
         }
         return res
   }

   console.log(locationData)
   React.useEffect(()=>{
       setMyPos(()=>{return(`https://api.mapbox.com/styles/v1/mapbox/light-v10/static/pin-l-embassy+f74e4e(${longitude},${latitude})/${longitude},${latitude},14/500x300?access_token=pk.eyJ1IjoibWFubWlrIiwiYSI6ImNsMTZ2dHZyODE3NmEzZHAzdTZ0c21jcDEifQ.sBBXg2yyb7U0aiDW2amJaw`)},[longitude,latitude])
   }) 
   console.log(longitude, latitude, mypos)
    function getLocation(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
            console.log(mypos)
          } 
          else { 
           console.log("Geolocation is not supported by this browser.") ;
          }
        }
    
    function showPosition(position) {
        setLatitude(position.coords.latitude);  
        setLongitude(position.coords.longitude);
        setVisible(true);
    }
    async function saveLocation(){
        await axios.post("http://localhost:4000/location/add",{
            img:mypos,
            long:longitude,
            lati:latitude
        }).then(res=>{console.log(res)
            getLocations()
        })
    }
    return(
        <>
        <Grid container spacing={2}>
            
                {mapblocks()}
            
        </Grid>
        
        <div className="locationform">
        <Stack spacing={2}>
        <TextField
          required
          id="outlined-required"
          label="Location Name"
          placeholder ="for eg: Andheri SD Corp"
          variant= "outlined"
        />
        <Button onClick={getLocation} variant="contained">Get Location</Button>
        {visible && <img src={mypos}/>}
        <Button onClick={saveLocation} variant="contained">Save Location</Button>

        </Stack>
        </div>
        </>
    )

}