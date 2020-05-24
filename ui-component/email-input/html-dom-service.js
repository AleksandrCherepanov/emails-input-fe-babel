export const createElementDiv = (className) => {
    let newTag = document.createElement("div");
    newTag.className = className;

    return newTag;
}

export const createElementImg = (imgSrc) => {
    let newImg = document.createElement("img");
    newImg.src = imgSrc;
    newImg.alt = "remove tag";

    return newImg;
}

export const appendTextToElement = (text, element) => {
    const textElement = document.createTextNode(text);
    element.appendChild(textElement);
}
