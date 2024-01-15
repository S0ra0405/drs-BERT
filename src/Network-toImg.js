imageMimes = ['image/jpeg', 'image/png']

function exportCanvas(imgMime){
    ////console.log('dlclick');
    canvas = document.getElementById('mynetwork').firstChild.firstChild;
    canvas.style = "background-color: #303534;"

    let link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "network.png";
    link.click();
}