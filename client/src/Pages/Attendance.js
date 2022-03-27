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
import * as faceapi from 'face-api.js'



function Attendance() {
  const videoHeight = 480;
  const videoWidth = 640;
  const[initializing, setInitializing] = React.useState(false);
  const video = React.useRef();
  const canvasRef = React.useRef();

  React.useEffect(()=> {
      const loadModels = async () => {
          const MODEL_URL = process.env.PUBLIC_URL + '/models';
          setInitializing(true);
          Promise.all([
              faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
              faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
              faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
              faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
              faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          ]).then(startVideo);
      }
      loadModels();
  }, [])

  const startVideo = () => {
      navigator.getUserMedia(
        {
          video: {},
        },
        (stream) => (video.current.srcObject = stream),
        (err) => console.log(err)
      );
    };

  async function handleVideoOnPlay () {

      //new
      const labeledDescriptors = await loadLabeledImages()
      console.log(labeledDescriptors)
      const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.5)



      setInterval(async () => {
          if (initializing){
              setInitializing(false);
          }
          canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(video.current);
          const displaySize = {
              width: videoWidth,
              height: videoHeight
          }
          faceapi.matchDimensions(canvasRef.current,displaySize);
          const detections = await faceapi.detectAllFaces(video.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
          console.log(detections);
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          canvasRef.current.getContext('2d').clearRect(0, 0, videoWidth, videoHeight);
          // faceapi.draw.drawDetections(canvasRef.current, resizedDetections)
          // faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections)
          // faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections)
          const results = resizedDetections.map((d) => {
              return faceMatcher.findBestMatch(d.descriptor)
          })
          
          results.forEach( (result, i) => {
              const box = resizedDetections[i].detection.box
              const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
              drawBox.draw(canvasRef.current)
              
                let index
                for(let i=0;i<attendance.length;i++){
                  if(attendance[i].fname==result.label){
                    index=i
                  }
                }
                attendanceChanger(index)
              console.log(result.label);
          })
      },1000)

     

  }

  function loadLabeledImages() {
      //const labels = ['Black Widow', 'Captain America', 'Hawkeye' , 'Jim Rhodes', 'Tony Stark', 'Thor', 'Captain Marvel']
      const labels = ['Mihir','Shaurya','Raghav'] // for WebCam
      return Promise.all(
          labels.map(async (label)=>{
              const descriptions = []
              for(let i=1; i<=2; i++) {
                  console.log(`../labeled_images/${label}/${i}.jpg`)
                  const img = await faceapi.fetchImage(`https://raw.githubusercontent.com/manmikalpha/Smart-Student-Attendance-System/master/.github/images/${label}/${i}.jpg`)
                  const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                  console.log(label + i + JSON.stringify(detections))
                  descriptions.push(detections.descriptor)
              }
              
              return new faceapi.LabeledFaceDescriptors(label, descriptions)
          })
      )
  }
  //////////////////////////////////////////////////////////////////////////////

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
    console.log(data[index].attendance);
    data[index].attendance= true;
    console.log(data[index].attendance)
    setAttendance(()=>{return(data)})
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
      <Box mt={10} ml={5}>
        <span>{initializing ? 'Initializing' : 'Ready' }</span>
        <div className="display-flex justify-content-center">
        <video ref={video} autoPlay muted height={videoHeight} width={videoWidth} onPlay={handleVideoOnPlay}/>
        <canvas ref={canvasRef} className="position-absolute"/>
        </div>
        </Box>
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
        <Table sx={{ minWidth: 800,  }} aria-label="customized table">
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