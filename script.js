const svg1 = document.getElementById("svg1");
const svg2 = document.getElementById("svg2");

svg1.style = "position: absolute; left: 0; top: 0";
svg2.style = "position: absolute; left: 0; top: 0";

svg1.position
const numberOfPaths = svg1.childNodes[2].childNodes[0].childNodes.length;
const svg2Path = document.getElementById(`path${numberOfPaths + 1}`);

function measurePath() {
    let circles = "";
    
    for(let pathNumber = 1; pathNumber <= numberOfPaths; pathNumber++){
        const path = document.getElementById(`path${pathNumber}`);
        if (!path) break;

        
        const pathLength = path.getTotalLength();
        for(let distance = 0; distance <= pathLength; distance += 5) {
            const point = path.getPointAtLength(distance);
            const isOverlapping = isPointOnPathClose(point, svg2Path, 10);//svg2Path.isPointInStroke(point);

            if (isOverlapping) console.log(point);
            circles += `<circle tabindex="0" fill="#fff" stroke="${isOverlapping ? "red" : "blue"}" cx="${point.x}" cy="${point.y}" r="0.5" />`;
        }
    }

    document.getElementById("circles").innerHTML = circles;
}

SVGElement.prototype.getTransformToElement = SVGElement.prototype.getTransformToElement || function(toElement) {
    return toElement.getScreenCTM().inverse().multiply(this.getScreenCTM());
};

function isPointOnPathClose(point, path, maxOffset) {
    const pathLength = path.getTotalLength();

    for(let distance = 0; distance <= pathLength; distance += maxOffset / 2) {

        // Todo - swap out this transform
        const pathPoint = path.getPointAtLength(distance).matrixTransform(path.getTransformToElement(svg1));
        
        if ((pathPoint.x - point.x) ** 2 + (pathPoint.y - point.y) ** 2 <= maxOffset ** 2) return true;
    }
    return false;
}


svg1.addEventListener("load", (event) => measurePath());
