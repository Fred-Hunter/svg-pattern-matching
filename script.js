const measurementGranularity = 5;
const translationGranularity = 30;

const targetSvg = document.getElementById("targetSvg");
const sourceSvg = document.getElementById("sourceSvg");

const targetSvgPaths = [...targetSvg.childNodes[2].childNodes[0].childNodes].filter(n => n.tagName === "path");
const targetSvgBounding = targetSvg.getBoundingClientRect();
const sourceSvgPath = document.getElementById(`path${targetSvgPaths.length + 1}`);
const sourceSvgBounding = sourceSvg.getBoundingClientRect();

function measurePath(xOffset, yOffset) {
    let circles = "";
    let hitCount = 0;
    let missCount = 0;

    sourceSvg.style.left = xOffset;
    sourceSvg.style.top = yOffset;

    const sourcePathLength = sourceSvgPath.getTotalLength();
    for (let distance = 0; distance <= sourcePathLength; distance += measurementGranularity) {
        const sourceSvgPoint = sourceSvgPath.getPointAtLength(distance);

        let isOverlapping = false;
        const sourceSvgPointInTargetSvgCoords = sourceSvgPoint.matrixTransform(sourceSvgPath.getTransformToElement(targetSvg));
        const sourceSvgPointInSourceSvgCoords = sourceSvgPoint.matrixTransform(sourceSvgPath.getTransformToElement(sourceSvg));

        targetSvgPaths.forEach(p => {
            isOverlapping = isOverlapping || p.isPointInStroke(sourceSvgPointInTargetSvgCoords);
        });

        circles += `<circle tabindex="0" fill="#fff" stroke="${isOverlapping ? "red" : "blue"}" cx="${sourceSvgPointInSourceSvgCoords.x}" cy="${sourceSvgPointInSourceSvgCoords.y}" r="0.5" />`;

        if (isOverlapping) {
            hitCount++;
        }
        else {
            missCount++;
        }
    }

    document.getElementById("circles").innerHTML = circles;
    return hitCount / (missCount + hitCount);
}

// getTransformToElement polyfill
SVGElement.prototype.getTransformToElement = SVGElement.prototype.getTransformToElement || function (toElement) {
    return toElement.getScreenCTM().inverse().multiply(this.getScreenCTM());
};

sourceSvg.addEventListener("load", (event) => tansformSourceOverTarget());

function tansformSourceOverTarget() {
    let bestTransform = { score: 0, x: 0, y: 0 };
    const totalInterations = ((targetSvgBounding.width - sourceSvgBounding.width) / translationGranularity) * ((targetSvgBounding.height - sourceSvgBounding.height) / translationGranularity);
    let iterationCounter = 0;

    for (let xOffset = 0; xOffset <= targetSvgBounding.width - sourceSvgBounding.width; xOffset += translationGranularity) {
        for (let yOffset = 0; yOffset <= targetSvgBounding.height - sourceSvgBounding.height; yOffset += translationGranularity) {
            iterationCounter++;
            const score = measurePath(xOffset, yOffset);    
            
            console.log(`${iterationCounter/totalInterations}, ${xOffset},${yOffset}, ${score}`);
            if (score > bestTransform.score) {
                bestTransform.x = xOffset;
                bestTransform.y = yOffset;
                bestTransform.score = score;

                console.log(bestTransform);

                if (score === 1) return bestTransform;
            }
        }
    }

    measurePath(bestTransform.x, bestTransform.y);
    return bestTransform;
}
