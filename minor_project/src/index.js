const dropZone = document.querySelector(".drop-zone");
dropZone.addEventListener("dragover", (e) => {
    console.log("dragged");
    dropZone.classList.add("dragged");
})