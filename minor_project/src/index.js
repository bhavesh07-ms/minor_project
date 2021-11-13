const dropZone = document.querySelector(".drop-zone");
const browseBtn = document.querySelector(".browseBtn");
const fileInput = document.querySelector("#fileInput");

const progressContainer = document.querySelector(".progress-container");
const bgProgress = document.querySelector(".bg-progress");
const progressBar = document.querySelector(".progress-bar");

const percentDiv = document.querySelector("#percent");

const fileURLInput = document.querySelector("#fileURL");

const sharingContainer = document.querySelector(".sharing-container")
const copyBtn = document.querySelector("#copyBtn");

const host = "https://innshare.herokuapp.com/";
const uploadURL = `${host}api/files`;


dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (!dropZone.classList.contains("dragged")) {
        dropZone.classList.add("dragged");
    }   
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragged");
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragged");
    const files = e.dataTransfer.files
    console.table(files);
    if (files.length) {
        fileInput.files = files;
        //uploading will be done in backend.
        uploadFile();
    }
 
})

fileInput.addEventListener("change",() => {
    uploadFile();
})

browseBtn.addEventListener("click", () => {
    fileInput.click();
});

copyBtn.addEventListener("click", () => {
    fileURLInput.select()
    document.execCommand("copy");
})
const uploadFile = () => {

    progressContainer.style.display = "block"; //display progress container on file upload

    //1 file from many
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("myFile",file);
    // upload file(xhr==how any files)
    const xhr = new XMLHttpRequest();
    //on uploading
    xhr.onreadystatechange = () => {
        //like(file.length == donefileurl.length)
        if(xhr.readyState == XMLHttpRequest.DONE) {
            console.log(xhr.response);
            showLink(JSON.parse(xhr.response)); //to show/pass the link of file
        }
    };
    xhr.upload.onprogress = updateProgress();
    //will post to the url
    xhr.open("POST",uploadURL)
    xhr.send(formData);

};

const updateProgress = (e) => {
    let percent = Math.round((e.loaded / e.total)*100);
    // console.log(percent);
    bgProgress.style.width = `${percent}%`;
    percentDiv.innerText = percent;  // percentage increase
    progressBar.style.transform = `scaleX(${percent/100})`;
}

const showLink = ({file: url}) => {
    console.log(file);
    progressContainer.style.display = "none";
    progressContainer.style.display = "block";
    fileURL.value = url;
}
