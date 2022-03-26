import React from "react";
import TextField from '@mui/material/TextField';
import Stack from "@mui/material/Stack";
import Button from '@mui/material/Button';

export default function Location(){
    
    const [longitude, setLongitude] = React.useState(0);
    const [latitude, setLatitude] = React.useState(0);
   const [mypos, setMyPos] = React.useState(undefined);
   const [visible, setVisible] = React.useState(false);

   React.useEffect(()=>{
       setMyPos(()=>{return(`https://api.mapbox.com/styles/v1/mapbox/light-v10/static/pin-l-embassy+f74e4e(${longitude},${latitude})/${longitude},${latitude},14/500x300?access_token=pk.eyJ1IjoibWFubWlrIiwiYSI6ImNsMTZ2dHZyODE3NmEzZHAzdTZ0c21jcDEifQ.sBBXg2yyb7U0aiDW2amJaw`)},[longitude,latitude])
   }) 

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
    function saveLocation(){

    }
    return(
        <>
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