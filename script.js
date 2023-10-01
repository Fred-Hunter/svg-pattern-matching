const svg1 = document.getElementById("svg1");
const svg2 = document.getElementById("svg2");

svg1.style = "position: absolute; left: 0; top: 0";
svg2.style = "position: absolute; left: 0; top: 0";

svg1.position
const svg1Paths = [...svg1.childNodes[2].childNodes[0].childNodes].filter(n => n.tagName === "path");
const svg2Path = document.getElementById(`path${svg1Paths.length + 1}`);

function measurePath() {
    let circles = "";
            
    const pathLength = svg2Path.getTotalLength();
    for(let distance = 0; distance <= pathLength; distance += 5) {
        const svg2Point = svg2Path.getPointAtLength(distance);
        
        let isOverlapping = false; 
        const svg2PointInSvg1Coords = svg2Point.matrixTransform(svg2Path.getTransformToElement(svg1));

        svg1Paths.forEach(p => {
            isOverlapping = isOverlapping || p.isPointInStroke(svg2PointInSvg1Coords);
        });

        circles += `<circle tabindex="0" fill="#fff" stroke="${isOverlapping ? "red" : "blue"}" cx="${svg2PointInSvg1Coords.x}" cy="${svg2PointInSvg1Coords.y}" r="0.5" />`;
    }

    document.getElementById("circles").innerHTML = circles;
}

// getTransformToElement polyfill
SVGElement.prototype.getTransformToElement = SVGElement.prototype.getTransformToElement || function(toElement) {
    return toElement.getScreenCTM().inverse().multiply(this.getScreenCTM());
};

svg2.addEventListener("load", (event) => measurePath());
