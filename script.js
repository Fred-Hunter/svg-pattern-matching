const targetSvg = document.getElementById("targetSvg");
const sourceSvg = document.getElementById("sourceSvg");

const targetSvgPaths = [...targetSvg.childNodes[2].childNodes[0].childNodes].filter(n => n.tagName === "path");
const sourceSvgPath = document.getElementById(`path${targetSvgPaths.length + 1}`);

function measurePath() {
    let circles = "";
            
    const sourcePathLength = sourceSvgPath.getTotalLength();
    for(let distance = 0; distance <= sourcePathLength; distance += 5) {
        const sourceSvgPoint = sourceSvgPath.getPointAtLength(distance);
        
        let isOverlapping = false; 
        const sourceSvgPointIntargetSvgCoords = sourceSvgPoint.matrixTransform(sourceSvgPath.getTransformToElement(targetSvg));

        targetSvgPaths.forEach(p => {
            isOverlapping = isOverlapping || p.isPointInStroke(sourceSvgPointIntargetSvgCoords);
        });

        circles += `<circle tabindex="0" fill="#fff" stroke="${isOverlapping ? "red" : "blue"}" cx="${sourceSvgPointIntargetSvgCoords.x}" cy="${sourceSvgPointIntargetSvgCoords.y}" r="0.5" />`;
    }

    document.getElementById("circles").innerHTML = circles;
}

// getTransformToElement polyfill
SVGElement.prototype.getTransformToElement = SVGElement.prototype.getTransformToElement || function(toElement) {
    return toElement.getScreenCTM().inverse().multiply(this.getScreenCTM());
};

sourceSvg.addEventListener("load", (event) => measurePath());
