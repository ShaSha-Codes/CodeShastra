import React from "react"
import * as helmet from 'helmetdetection';



export default function FaceRecognition() {

    const videoHeight = 480;
    const videoWidth = 640;
    const[initializing, setInitializing] = React.useState(false);
    const video = React.useRef();
    const canvasRef = React.useRef();

    
    const startVideo = () => {
        navigator.getUserMedia(
          {
            video: {},
          },
          (stream) => (video.current.srcObject = stream),
          (err) => console.log(err)
        );
      };
      startVideo();

    async function handleVideoOnPlay () {

        //new
        // const labeledDescriptors = await loadLabeledImages()
        // console.log(labeledDescriptors)
        // const faceMatcher = new helmet.FaceMatcher(labeledDescriptors, 0.45)

        const model = await helmet.load('../model/model.json');

        setInterval(async () => {
            if (initializing){
                setInitializing(false);
            }
            canvasRef.current.innerHTML = helmet.createCanvasFromMedia(video.current);
            const displaySize = {
                width: videoWidth,
                height: videoHeight
            }
            helmet.matchDimensions(canvasRef.current,displaySize);
            const predictions = await model.detect(video.current);
            console.log(predictions);
            const resizedDetections = helmet.resizeResults(predictions, displaySize);
            canvasRef.current.getContext('2d').clearRect(0, 0, videoWidth, videoHeight);
            // helmet.draw.drawDetections(canvasRef.current, resizedDetections)
            // helmet.draw.drawFaceLandmarks(canvasRef.current, resizedDetections)
            // helmet.draw.drawFaceExpressions(canvasRef.current, resizedDetections)
            // const results = resizedDetections.map((d) => {
            //     return faceMatcher.findBestMatch(d.descriptor)
            // })
                // const box = resizedDetections.detection.box
                // const drawBox = new helmet.draw.DrawBox(box, { label: result.toString() })
                // drawBox.draw(canvasRef.current)
               
            
        },1000)

       

    }

    // function loadLabeledImages() {
    //     //const labels = ['Black Widow', 'Captain America', 'Hawkeye' , 'Jim Rhodes', 'Tony Stark', 'Thor', 'Captain Marvel']
    //     const labels = ['Mihir','Shaurya','Raghav'] // for WebCam
    //     return Promise.all(
    //         labels.map(async (label)=>{
    //             const descriptions = []
    //             for(let i=1; i<=2; i++) {
    //                 console.log(`../labeled_images/${label}/${i}.jpg`)
    //                 const img = await helmet.fetchImage(`https://raw.githubusercontent.com/manmikalpha/Smart-Student-Attendance-System/master/.github/images/${label}/${i}.jpg`)
    //                 const predictions = await helmet.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
    //                 console.log(label + i + JSON.stringify(predictions))
    //                 descriptions.push(predictions.descriptor)
    //             }
    //             document.body.append(label+' Faces Loaded | ')
    //             return new helmet.LabeledFaceDescriptors(label, descriptions)
    //         })
    //     )
    // }

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
