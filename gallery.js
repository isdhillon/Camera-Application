//opening index db
let request=indexedDB.open("Camera",1);
//local database
let db;

//requesting indexdb
request.onsuccess=function(e){
    //storing the result in the database
    db=request.result;
}
//if request fails
request.onerror=function(e){
    console.log("error")
}

//when a database of a bigger version number than the existing stored database is loaded.
request.onupgradeneeded=function(e){
    db=request.result;
    //create new object
    //key path defined when making the new object store 
    //used to identify the object
    db.createObjectStore("gallery",{keyPath:"mId"})

}
//add the data to the gallery
function addMediaToGallery(data,type){
    // If you need to open the object store in readwrite mode
    let tx=db.transaction("gallery","readwrite");
    //returns the same transaction object
    let gallery=tx.objectStore("gallery")
    //to store the value in the object store
    gallery.add({mId:Date.now(),type,media:data})
}

//view gallery
function viewMedia(){
    let gBody=document.querySelector(".gallery");
    //readonly mode
    let tx=db.transaction("gallery","readonly");
    let gallery=tx.objectStore("gallery");
    //Used for iterating through an object store with a cursor.
    let req=gallery.openCursor();
    //on successful request
    req.onsuccess=function(e){
        //theres a loop on the cursors
        let cursor=req.result;
        if(cursor){
            //if its a video
            if(cursor.value.type=="video"){
                //make video-container
                let videoContainer=document.createElement("div");
                //adding the mid id value to the html tag so that it can be uniquely identified
                videoContainer.setAttribute("data-mid",cursor.value.mId);
                //adding class
                videoContainer.classList.add("gallery-video-container");
                //making video element
                let video=document.createElement("video");
                videoContainer.appendChild(video);
                //adding delete button
                let deleteBtn=document.createElement("button");
                deleteBtn.classList.add("gallery-delete-button");
                deleteBtn.innerText="Delete";
                deleteBtn.addEventListener("click",deleteBtnHandler);
                //adding downoload button
                let downloadBtn=document.createElement("button");
                downloadBtn.classList.add("gallery-download-button");
                downloadBtn.innerText="Download"
                downloadBtn.addEventListener("click",downloadBtnHandler);
                //appending delete and download button to the video container
                videoContainer.appendChild(deleteBtn)
                videoContainer.appendChild(downloadBtn)
                //adding video controls
                video.autoplay=true;
                video.controls=true;
                video.loop=true;
                //geeting the video url from blob object
                video.src=window.URL.createObjectURL(cursor.value.media);
                //appending it to the gallery
                gBody.appendChild(videoContainer);
            }
            else{
                //making image container
                let imageContainer=document.createElement("div");
                //add the mid key
                imageContainer.setAttribute("data-mid",cursor.value.mId);
                imageContainer.classList.add("gallery-img-container");
                //create image 
                let image=document.createElement("img");
                //getting image src from index db
                image.src=cursor.value.media;
                imageContainer.appendChild(image);
                //adding delete button
                let deleteBtn=document.createElement("button");
                deleteBtn.classList.add("gallery-delete-button");
                deleteBtn.innerText="Delete";
                deleteBtn.addEventListener("click",deleteBtnHandler);
                //adding download button
                let downloadBtn=document.createElement("button");
                downloadBtn.classList.add("gallery-download-button");
                downloadBtn.innerText="Download"
                downloadBtn.addEventListener("click",downloadBtnHandler);
                //appening buttons to image container
                imageContainer.appendChild(deleteBtn)
                imageContainer.appendChild(downloadBtn)
                //appending image to gallery
                gBody.appendChild(imageContainer);
            }
            //next object
            cursor.continue();
        }
    }


}
//deletion from gallery
function deleteMediaFromGallery(mId){
    //opening database in readwrite mode
    let tx=db.transaction("gallery","readwrite");
    let gallery=tx.objectStore("gallery");
    //deleting the entry from gallery Number conversion to covert data into number
    //because the date is no
    gallery.delete(Number(mId))
}
//delete button event listener
function deleteBtnHandler(e){
    //getting the value of mid
    let mId=e.currentTarget.parentNode.getAttribute("data-mId")
    deleteMediaFromGallery(mId);
    //removing from the databse
    e.currentTarget.parentNode.remove()
}
//download button event listener
function downloadBtnHandler(e){
    //creating anchor tag
    let a =document.createElement("a");
    //getting the href from indexdb
    a.href=e.currentTarget.parentNode.children[0].src;
    //in case of image
    if(e.currentTarget.parentNode.children[0].nodeName=="IMG"){
        a.download="image.png"
    }
    //in case of video
    else{
        a.download="video.mp4"
    }
    //click on the anchor tag
    a.click();
    //delete the anchor tag
    a.remove();
}