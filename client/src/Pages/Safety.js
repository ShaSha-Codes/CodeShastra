import React from "react"
import * as faceapi from 'face-api.js'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Webcam from "react-webcam";
import * as cvstfjs from "@microsoft/customvision-tfjs";

export default function Safety() {

    const videoHeight = 480;
    const videoWidth = 640;
    const[initializing, setInitializing] = React.useState(false);
    const [violation,setViolation]=React.useState(0)
    const video = React.useRef();
    const canvasRef = React.useRef();
    const webcamRef = React.useRef(null);
    const [svideoWidth, setVideoWidth] = React.useState(960);
    const [svideoHeight, setVideoHeight] = React.useState(640);
    
    async function predictionFunction() {
        setVideoHeight(webcamRef.current.video.videoHeight);
        setVideoWidth(webcamRef.current.video.videoWidth);
        //testing azure vision api
        let model = new cvstfjs.ObjectDetectionModel();
        await model.loadModelAsync("model.json");
        const predictions = await model.executeAsync(
        document.getElementById("img")
        );
        var cnvs = document.getElementById("myCanvas");
        cnvs.style.position = "absolute";
        var ctx = cnvs.getContext("2d");
        ctx.clearRect(0, 0, cnvs.width, cnvs.height);
        console.log(predictions);
        if (predictions[0].length > 0) {
        for (let n = 0; n < predictions[0].length; n++) {
        // Check scores
        if (predictions[1][n] > 0.5) {
        const p = document.createElement("p");
        p.innerText = "Pill" + ": " + Math.round(parseFloat(predictions[1][n]) * 100) + "%";
        let bboxLeft = predictions[0][n][0] * webcamRef.current.video.videoWidth;
        let bboxTop = predictions[0][n][1] * webcamRef.current.video.videoHeight;
        let bboxWidth = predictions[0][n][2] * webcamRef.current.video.videoWidth - bboxLeft;
        let bboxHeight = predictions[0][n][3] * webcamRef.current.video.videoHeight - bboxTop;
        ctx.beginPath();
        ctx.font = "28px Arial";
        ctx.fillStyle = "red";
        ctx.fillText( "Pill" + ": " + Math.round(parseFloat(predictions[1][n]) * 100) + "%", bboxLeft, bboxTop + 70 );
        ctx.rect(bboxLeft, bboxTop + 80, bboxWidth, bboxHeight);
        ctx.strokeStyle = "#FF0000";
        ctx.lineWidth = 3;
        ctx.stroke();
        }}
        setTimeout(() => predictionFunction(), 500);
        }}
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
        const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.45)



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
           
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            canvasRef.current.getContext('2d').clearRect(0, 0, videoWidth, videoHeight);
            // faceapi.draw.drawDetections(canvasRef.current, resizedDetections)
            // faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections)
            // faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections)
            const results = resizedDetections.map((d) => {
                return faceMatcher.findBestMatch(d.descriptor)
            })
            let drawBox
            results.forEach( (result, i) => {
                const box = resizedDetections[i].detection.box
                if(result.label=="Shaurya"){
                    drawBox = new faceapi.draw.DrawBox(box, { label: "Hardhat" })
                    
                }else{
                    drawBox = new faceapi.draw.DrawBox(box, { label: "Shaurya" })
                    setViolation((prevVal=>prevVal+0.01))

                }
                
                
                drawBox.draw(canvasRef.current)
                
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

    return(
        <>
        <span>{initializing ? 'Initializing' : 'Ready' }</span>
        <div  className="display-flex justify-content-center">
        <video ref={video} autoPlay muted height={videoHeight} width={videoWidth} onPlay={handleVideoOnPlay} />
        <canvas ref={canvasRef} className="position-absolute"/>
        </div>
        <Box mt={10}  sx={{flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Paper sx={{marginLeft:"auto",marginRight:"auto",height:"300px",width:"300px"}} elevation={12}>
                <Typography sx={{marginTop:"25%",textAlign:"center"}} variant="h2" component="div" gutterBottom>
                        {violation.toFixed(2)}
                    </Typography>
                    <Typography sx={{textAlign:"center"}} variant="h4" component="div" gutterBottom>
                        Violations
                    </Typography>
                    
                </Paper>
            </Grid>
        </Box>
        </>
    )
       
        
}