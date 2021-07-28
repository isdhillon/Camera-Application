//declarations
let videoElem=document.querySelector("video");
let recordBtn=document.querySelector(".record")
let captureImgBtn=document.querySelector(".click-image")
let filterOverlay=document.querySelector(".filter-overlay");
let filterArr=document.querySelectorAll(".filter")
let timing=document.querySelector(".timing");
let isRecording =false;
let scaleLevel=1;
let filterColor=""
let counter=0;
let clearObj;
let minusBtn=document.querySelector(".minus");
let plusBtn=document.querySelector(".plus");
let galleryBtn=document.querySelector(".gallery")
//constaraint for video
let constraint={
    audio:true,
    video:true
}
//recording array
let recording=[];
//media recorder object
let mediaRecordingObjectForCurrentStream;
//MediaStream with the audio and video promise
let userMediaPromise=navigator.mediaDevices.getUserMedia(constraint);
//when promise is exceucted
userMediaPromise.then(function(stream)
{
    //srcObject returns the object which serves as the source of the media associated with the HTMLMediaElement
    videoElem.srcObject=stream;
    //creates a new MediaRecorder object that will record a specified MediaStream
    mediaRecordingObjectForCurrentStream=new MediaRecorder(stream);
    //if data is available
    mediaRecordingObjectForCurrentStream.ondataavailable=function(e){
        //addind the recorded data to the array
        recording.push(e.data);
    }
    //adding stop event listener on the media recorder object
    mediaRecordingObjectForCurrentStream.addEventListener("stop",function(){
        //create a blob
        const blob=new Blob(recording,{type:'video/mp4'})
        //Adding it to gallery
        addMediaToGallery(blob,"video");
        //empty the recording array
        recording=[];
    })
})
//if promise is not resolved
.catch(function(err){
    console.log(err);
    alert("please allow both microphone and camera")
})
//record button event listener
recordBtn.addEventListener("click",function(){ 
    //if media object is not defined
    if(mediaRecordingObjectForCurrentStream==undefined){
        alert("Fist select the devices");
        return;
    }
    //if recording is false
    if(isRecording==false){
        //start the media object
        mediaRecordingObjectForCurrentStream.start();
        //showing timing
        recordBtn.classList.add("record-animation")
        //starting timer
        startTimer()
    }
    else{
        //stop the media object
        mediaRecordingObjectForCurrentStream.stop();
        //stop timer
        stopTimer()
        //hide timer
        recordBtn.classList.remove("record-animation");
    }
    //update is recording
    isRecording=!isRecording
})
//capture button event listener
captureImgBtn.addEventListener("click",function(){
    captureImgBtn.classList.add("capture-animation");
    //create canvas
    let canvas=document.createElement("canvas");
    //canvas height equal to video height
    canvas.height=videoElem.videoHeight;
    //camvas width is equal to canvas width
    canvas.width=videoElem.videoWidth;
    //method on drawing on th ecanvas
    let tool=canvas.getContext("2d")
    //adding scaling property 
    tool.scale(scaleLevel,scaleLevel)
    //x and y coordinate
    const x=(tool.canvas.width/scaleLevel-videoElem.videoWidth)/2;
    const y=(tool.canvas.height/scaleLevel-videoElem.videoHeight)/2
    //draw image(to be drawn,x,y cordinate)
    tool.drawImage(videoElem,x,y);
    //if any filters add to the image
    if(filterColor){
        //filling the color to canvas
        tool.fillStyle=filterColor;
        //drawing the rectangle of the selected filter on the image
        tool.fillRect(0,0,canvas.width,canvas.height);
    }
    //get the url of the canvas
    let url=canvas.toDataURL();
    //adding image to gallery
    addMediaToGallery(url,"img")
})

//filter color array
for(let i=0;i<filterArr.length;i++){
    filterArr[i].addEventListener("click",function(){
        //getting the selected filter color
        filterColor=filterArr[i].style.backgroundColor;
        //applying the filter on the container
        filterOverlay.style.backgroundColor=filterColor;
    })
}

//timing
function startTimer(){
    //displaying timmer
    timing.style.display="block"
    function fn(){
        //getting the no of hours
        let hours=Number.parseInt(counter/3600);
        let remSeconds=counter%3600;
        //no of min
        let mins=Number.parseInt(remSeconds/60);
        //no of seconds
        let Seconds=remSeconds%60;
        //displaying
        hours=hours<10 ? `0${hours}` : `${hours}`;
        mins=mins<10? `0${mins}`:`${mins}`;
        Seconds=Seconds<10? `0${Seconds}` :`${Seconds}`;
        //updating the tag
        timing.innerText=`${hours}:${mins}:${Seconds}`
        //increment counter
        counter++;
    }
    //set interval for object
    clearObj=setInterval(fn,1000);

}
function stopTimer(){
    //hiding the timmer
    timing.style.display="none";
    //clearing the interval
    clearInterval(clearObj)
}

//zoom container
minusBtn.addEventListener("click",function(){
    //decreasing scale level
    if(scaleLevel>1){
        scaleLevel=scaleLevel-0.1;
        //applying it on the video
        videoElem.style.transform=`scale(${scaleLevel})`
    }
})
plusBtn.addEventListener("click",function(){
    //increasing the scale level
    if(scaleLevel<1.7){
        scaleLevel=scaleLevel+0.1;
        //applying it on the video
        videoElem.style.transform=`scale(${scaleLevel})`
    }
})

//gallery button
galleryBtn.addEventListener("click",function(){
    location.assign("gallery.html")
})