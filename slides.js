function clearContent() {
    let content = document.querySelector("#content")
    content.innerHTML = ""
}


function titleSlideTitle(text) {
}

function Slide() {
    this.div = document.createElement("div")
    this.div.classList.add("slide")
    this.hide()
}

Slide.prototype.show = function() {
    this.div.classList.remove("slide-hidden")
}

Slide.prototype.hide = function() {
    this.div.classList.add("slide-hidden")
}

Slide.prototype.title = function(text) {
    let h = document.createElement("h2")
    h.classList.add("slide-title")
    h.appendChild(document.createTextNode(text))
    this.div.appendChild(h)
    return this
}

Slide.prototype.p = function(text) {
    let p = document.createElement("p")
    p.appendChild(document.createTextNode(text))
    this.div.appendChild(p)
    return this
}

//
//let slides = [
//    emptySlide().slideTitle("Hello"),
//    emptySlide().slideTitle("World"),
//]
//
//function setSlide(slide) {
//    if (typeof slide === "number") {
//        slide = slides[slide]
//    }
//    clearContent()
//    let content = document.querySelector("#content")
//    content.appendChild(slide)
//}
//
//setSlide(1)
//let content = document.querySelector("#content")
//window.setTimeout(() => { console.log("hi"); setSlide(slides[0]) }, 1000)
//setSlide(slides[0])

let slides = []

Slide.prototype.build = function() {
    slides.push(this)
    let content = document.querySelector("#content")
    content.appendChild(this.div)
    return this
}

new Slide()
    .title("Hello")
    .p("world")
    .build()

new Slide()
    .title("Hola")
    .p("mundo")
    .build()

let the_index = 0
slides[0].show()

function nextSlide() {
    if (the_index + 1 < slides.length) {
        slides[the_index].hide()
        the_index++;
        slides[the_index].show()
    }
}

function prevSlide() {
    if (the_index > 0) {
        slides[the_index].hide()
        the_index--;
        slides[the_index].show()
    }
}

document.addEventListener('keydown', (event) => {
    let key = event.key;
    console.log(event)
    if (key === "ArrowLeft") {
        prevSlide()
    } else if (key === "ArrowRight") {
        nextSlide()
    }
});
document.addEventListener('click', (event) => {
    if (!drew) {
        nextSlide()
    }
    drew = false
});


let canvas = document.querySelector('#canvas');

// get canvas 2D context and set him correct size
var ctx = canvas.getContext('2d');
resize();

// last known position
var pos = { x: 0, y: 0 };
var touchStartPos = { x: null, y: null };

window.addEventListener('resize', resize);
document.addEventListener('mousemove', draw, {passive:false});
document.addEventListener('mousedown', setPosition);
document.addEventListener('mouseup', finishPath);
document.addEventListener('mouseenter', setPosition);
document.addEventListener('touchstart', setPosition);
document.addEventListener('touchmove', draw, {passive:false});
document.addEventListener('touchend', finishPath);
document.addEventListener('touchstart', rememberStart);
document.addEventListener('touchmove', detectSwipe);
document.querySelector("#clear-button").addEventListener("click", (event) => {
    event.stopPropagation()
    clearDrawings()
})
document.querySelector("#clear-button").addEventListener("touchmove", (event) => {
    event.stopPropagation()
    clearDrawings()
})
document.querySelector("#back-button").addEventListener("click", () => {
    event.stopPropagation()
    prevSlide()
})
document.querySelector("#back-button").addEventListener("touchmove", (event) => {
    event.stopPropagation()
    prevSlide()
})
document.querySelector("#forward-button").addEventListener("click", () => {
    event.stopPropagation()
    nextSlide()
})
document.querySelector("#forward-button").addEventListener("touchmove", (event) => {
    event.stopPropagation()
    nextSlide()
})

document.querySelector("#pointer-button").addEventListener("click", () => {
    event.stopPropagation()
    pointerMode = !pointerMode
    if (pointerMode) {
        document.querySelector("#pointer-button").style.backgroundColor = "#eeeeee";
    } else {
        document.querySelector("#pointer-button").style.backgroundColor = "transparent";
    }
})
document.querySelector("#pointer-button").addEventListener("touchmove", (event) => {
    event.stopPropagation()
    pointerMode = !pointerMode
})

function rememberStart(e) {
    if (e.touches.length == 1) {
        touchStartPos.x = e.touches[0].clientX
        touchStartPos.y = e.touches[0].clientY
    }
}

function detectSwipe(e) {
    if (e.touches.length == 1 &&
        touchStartPos.x !== null && touchStartPos.y !== null) {

        if (e.touches[0].touchType === undefined ||
            e.touches[0].touchType === "stylus")
            return;

        var xUp = e.touches[0].clientX;
        var yUp = e.touches[0].clientY;
        var xDiff = touchStartPos.x - xUp;
        var yDiff = touchStartPos.y - yUp;
        //l.innerText = "" + xDiff + ", " + yDiff
        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            if (xDiff > 0) {
                /* left swipe */
                nextSlide()
            } else {
                /* right swipe */
                prevSlide()
            }
        } else {
            if (yDiff > 0) {
                /* up swipe */
            } else {
                /* down swipe */
            }
        }
        touchStartPos.x = null;
        touchStartPos.y = null;
    }
}



// new position from mouse event
function setPosition(e) {
    if (e instanceof MouseEvent) {
        pos.x = e.clientX
        pos.y = e.clientY
    } else if (e instanceof TouchEvent) {
        if (e.touches.length == 1) {
            pos.x = e.touches[0].clientX
            pos.y = e.touches[0].clientY
        }
    }
}

// resize canvas
function resize() {
    ctx.canvas.width = window.innerWidth
    ctx.canvas.height = window.innerHeight
}

let mycanvas = []
let currentPath = null
let pointerMode = false

var timerId;

var drew = false
function draw(e) {
    //document.querySelector("#log").innerText = "" + e.clientX + ", " + e.clientY
    if (e instanceof MouseEvent && e.buttons !== 1) return;
    if (e instanceof TouchEvent) {
        if (e.touches.length != 1) return;
        if (e.touches[0].touchType === undefined ||
            e.touches[0].touchType !== "stylus")
            return;
    }
    e.preventDefault()

    drew = true;

    // let l = document.querySelector("#log")
    // l.innerText = "" + e
    // if (timerId) {
    //     window.clearTimeout(timerId)
    // }
    // timerId = window.setTimeout(() => {l.innerText = ""}, 5000)
    
    if (!pointerMode) {
        if (currentPath === null) {
            currentPath = [[pos.x, pos.y]]
        }

        ctx.beginPath() // begin


        ctx.lineCap = 'round'
        ctx.linejoin = 'round'
        ctx.strokeStyle = '#c0392b'
        ctx.lineWidth = 5

        ctx.moveTo(pos.x, pos.y) // from
        setPosition(e)
        ctx.lineTo(pos.x, pos.y) // to

        currentPath.push([pos.x, pos.y])
        ctx.stroke() // draw it!
    } else {
        setPosition(e)
        //l.innerText += "\n" + pos.x + ", " + pos.y
        redrawLines()
        ctx.beginPath() // begin
        ctx.lineCap = 'round'
        ctx.linejoin = 'round'
        ctx.fillStyle = '#c0392b'
        ctx.lineWidth = 0
        
        ctx.moveTo(pos.x, pos.y)
        ctx.arc(pos.x, pos.y, 10, 0, 2 * Math.PI)
        ctx.fill()
    }


}

function finishPath() {
    if (currentPath !== null) {
        console.log("finish")
        mycanvas.push(currentPath);
        currentPath = null
        redrawLines()
    }
    if (pointerMode) {
        redrawLines()
    }
}

function clearDrawings() {
    mycanvas = []
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

function redrawLines() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.beginPath()
    ctx.lineCap = 'round'
    ctx.linejoin = 'round'
    ctx.strokeStyle = '#c0392b'
    ctx.lineWidth = 5
    var p = null;
    for (let path of mycanvas) {
        console.log(path)
        ctx.moveTo(path[0][0], path[0][1])

        for (var i = 1; i < path.length; i++) {
            ctx.lineTo(path[i][0], path[i][1])
        }
    }
    ctx.stroke()
}

/*
var pts;

function redrawCurved() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    console.log(mycanvas)
    for (let path of mycanvas) {
        pts = []
        for (let pt of path) {
            pts.push(pt[0])
            pts.push(pt[1])
        }
        drawCurve(ctx, pts)
    }
}

function drawLines(ctx, pts) {
    ctx.moveTo(pts[0], pts[1]);
    for(i=2;i<pts.length-1;i+=2) {
        ctx.lineTo(pts[i], pts[i+1]);
    }
}

function drawCurve(ctx, ptsa, tension, isClosed, numOfSegments, showPoints) {

    showPoints  = showPoints ? showPoints : false;

    ctx.beginPath();

    drawLines(ctx, getCurvePoints(ptsa, tension, isClosed, numOfSegments));
    ctx.stroke();

    if (showPoints) {
        ctx.beginPath();
        for(var i=0;i<ptsa.length-1;i+=2)
                ctx.rect(ptsa[i] - 2, ptsa[i+1] - 2, 4, 4);
        ctx.stroke();
    }
}

function getCurvePoints(pts, tension, isClosed, numOfSegments) {

    // use input value if provided, or use a default value
    tension = (typeof tension != 'undefined') ? tension : 0.5;
    isClosed = isClosed ? isClosed : false;
    numOfSegments = numOfSegments ? numOfSegments : 16;

    var _pts = [], res = [],    // clone array
        x, y,           // our x,y coords
        t1x, t2x, t1y, t2y, // tension vectors
        c1, c2, c3, c4,     // cardinal points
        st, t, i;       // steps based on num. of segments

    // clone array so we don't change the original
    //
    _pts = pts.slice(0);

    // The algorithm require a previous and next point to the actual point array.
    // Check if we will draw closed or open curve.
    // If closed, copy end points to beginning and first points to end
    // If open, duplicate first points to befinning, end points to end
    if (isClosed) {
        _pts.unshift(pts[pts.length - 1]);
        _pts.unshift(pts[pts.length - 2]);
        _pts.unshift(pts[pts.length - 1]);
        _pts.unshift(pts[pts.length - 2]);
        _pts.push(pts[0]);
        _pts.push(pts[1]);
    }
    else {
        _pts.unshift(pts[1]);   //copy 1. point and insert at beginning
        _pts.unshift(pts[0]);
        _pts.push(pts[pts.length - 2]); //copy last point and append
        _pts.push(pts[pts.length - 1]);
    }

    // ok, lets start..

    // 1. loop goes through point array
    // 2. loop goes through each segment between the 2 pts + 1e point before and after
    for (i=2; i < (_pts.length - 4); i+=2) {
        for (t=0; t <= numOfSegments; t++) {

            // calc tension vectors
            t1x = (_pts[i+2] - _pts[i-2]) * tension;
            t2x = (_pts[i+4] - _pts[i]) * tension;

            t1y = (_pts[i+3] - _pts[i-1]) * tension;
            t2y = (_pts[i+5] - _pts[i+1]) * tension;

            // calc step
            st = t / numOfSegments;

            // calc cardinals
            c1 =   2 * Math.pow(st, 3)  - 3 * Math.pow(st, 2) + 1;
            c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2);
            c3 =       Math.pow(st, 3)  - 2 * Math.pow(st, 2) + st;
            c4 =       Math.pow(st, 3)  -     Math.pow(st, 2);

            // calc x and y cords with common control vectors
            x = c1 * _pts[i]    + c2 * _pts[i+2] + c3 * t1x + c4 * t2x;
            y = c1 * _pts[i+1]  + c2 * _pts[i+3] + c3 * t1y + c4 * t2y;

            //store points in array
            res.push(x);
            res.push(y);

        }
    }

    return res;
}


//var myPoints = [10,10, 40,30, 100,10, 200, 100, 200, 50, 250, 120];

//drawCurve(ctx, myPoints, 0.5, undefined, undefined, true);
*/
