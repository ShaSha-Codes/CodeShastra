import React from "react"
import * as faceapi from 'face-api.js'



export default function FaceRecognition() {

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
                document.body.append(label+' Faces Loaded | ')
                return new faceapi.LabeledFaceDescriptors(label, descriptions)
            })
        )
    }

    return(
        <>
        <span>{initializing ? 'Initializing' : 'Ready' }</span>
        <div className="display-flex justify-content-center">
        <video ref={video} autoPlay muted height={videoHeight} width={videoWidth} onPlay={handleVideoOnPlay}/>
        <canvas ref={canvasRef} className="position-absolute"/>
        </div>
        </>
    )
}