function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const fieldElement = document.getElementById(data).cloneNode(true);
    fieldElement.removeAttribute("draggable");
    fieldElement.setAttribute("contenteditable", "true");
    event.target.appendChild(fieldElement);
}
