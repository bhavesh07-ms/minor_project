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

const emailForm = document.querySelector("#emailForm");

const host = "https://innshare.herokuapp.com/";
const uploadURL = `${host}api/files`;
const emailURL = `${host}api/files/send`;

const toast = document.querySelector(".toast");

const maxAllowedSize = 100 * 1024 * 1024; //100mb

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
    fileURLInput.select();
    document.execCommand("copy");
    showToast("copied to clipboard")
})
const uploadFile = () => {

    if(fileInput.files.length > 1) {
        resetFileInput()
        showToast("only upload 1 file");
        return
    }

    //1 file from many
    const file = fileInput.files[0];

    if(file.size > maxAllowedSize) {
        showToast("file size is greater than 100mb");
        resetFileInput();
        return
    }
    progressContainer.style.display = "block"; //display progress container on file upload

    emailForm[2].setAttribute("disabled", "true");
    
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

    xhr.upload.onerror = () => {
        resetFileInput()
        showToast(`Error on uploding file ${xhr.status}`);
    }
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

const onUploadSuccess = ({file: url}) => {
    console.log(url);

    resetFileInput()

    emailForm[2].removeAttribute("disabled");
    progressContainer.style.display = "none";
    progressContainer.style.display = "block";
    fileURLInput.value = url;
}
 
const resetFileInput = () => {
    fileInput.value = "";
}

emailForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Submit form");
    const url = fileURLInput.value;

    const formData = {
        uuid: url.split("/").splice(-1, 1)[0],
        emailTo: emailForm.elements["to-email"].value,
        emailFrom: emailForm.elements["from-email"].value,
    };

    emailForm[2].setAttribute("disabled", "true"); //to disable send button once email is sent

    console.table(formData);
    fetch(emailURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    }) 
    .then((res => res.json())
    .then(({success}) => {
        if (success) {
            sharingContainer.style.display = "none";
            showToast("Email Sent")
        }
    }));
});
let toastTimer;
const showToast = (msg) => {
    toast.innerText = msg;
    toast.style.transform = "translate(-50%,0)";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.style.transform = "translate(-50%,0)";
    },2000);
}
