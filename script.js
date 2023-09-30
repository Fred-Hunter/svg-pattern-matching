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
        for(let distance = 0; distance <= pathLength; distance++) {
            const point = path.getPointAtLength(distance);
            const isOverlapping = svg2Path.isPointInStroke(point);
            if (isOverlapping) console.log(point);
            circles += `<circle tabindex="0" fill="hsla(60,60%,70%,.5)" stroke="${isOverlapping ? "red" : "blue"}" cx="${point.x}" cy="${point.y}" r="0.5" />`;
        }
    }

    document.getElementById("circles").innerHTML = circles;
}


svg1.addEventListener("load", (event) => measurePath());
