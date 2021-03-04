function clearContent() {
    let content = document.querySelector("#content")
    content.innerHTML = ""
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

Slide.prototype.section = function(text, subtitle) {
    let h = document.createElement("h1")
    h.classList.add("section-title")
    h.appendChild(document.createTextNode(text))
    this.div.appendChild(h)
    this.div.style.display = "flex";
    this.div.style.flexDirection = "column";
    this.div.style.justifyContent = "center";
    this.div.style.alignItems = "center";
    this.div.style.height = "100%";

    if (subtitle) {
        h = document.createElement("h2")
        h.classList.add("section-subtitle")
        h.appendChild(document.createTextNode(subtitle))
        this.div.appendChild(h)
    }

    return this
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

let slides = []

Slide.prototype.build = function() {
    slides.push(this)
    let content = document.querySelector("#content")
    content.appendChild(this.div)
    return this
}

new Slide()
    .section("My Talk", "James Wilcox")
    .build()

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

var ctx = canvas.getContext('2d');
resize();

function Point2d(x, y) {
    this.x = x;
    this.y = y;
}

Point2d.prototype.add = function(other) {
    return new Point2d(this.x + other.x, this.y + other.y)
}
Point2d.prototype.sub = function(other) {
    return new Point2d(this.x - other.x, this.y - other.y)
}
Point2d.prototype.distTo = function(other) {
    return this.sub(other).norm()
}
Point2d.prototype.dot = function(other) {
    return this.x * other.x + this.y * other.y
}
Point2d.prototype.norm = function() {
    return Math.sqrt(this.dot(this))
}
// operates on vectors, not points
Point2d.prototype.cross = function(other) {
    return this.x * other.y - this.y * other.x
}

function Line(p0, p1) {
    this.p0 = p0;
    this.p1 = p1;
}
Line.prototype.perpDist = function(pt) {
    var v0 = pt.sub(this.p0)
    var v1 = pt.sub(this.p1)
    var c = v0.cross(v1)
    //console.log(v0, v1, c, this.p0.distTo(this.p1))
    return Math.abs(c) / this.p0.distTo(this.p1)
}


var pos = new Point2d(0, 0)
var touchStartPos = null

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

function touchPos(e) {
    return new Point2d(e.touches[0].clientX, e.touches[0].clientY)
}

function rememberStart(e) {
    if (e.touches.length == 1) {
        touchStartPos = touchPos(e)
    }
}

function detectSwipe(e) {
    if (e.touches.length == 1 &&
        touchStartPos !== null) {

        // only swipe with finger, not pencil
        if (e.touches[0].touchType === undefined ||
            e.touches[0].touchType === "stylus")
            return;

        var diff = touchStartPos.sub(touchPos(e))
        //l.innerText = "" + xDiff + ", " + yDiff
        if (Math.abs(diff.x) > Math.abs(diff.y)) {
            if (diff.x > 0) {
                /* left swipe */
                nextSlide()
            } else {
                /* right swipe */
                prevSlide()
            }
        } else {
            if (diff.y > 0) {
                /* up swipe */
            } else {
                /* down swipe */
            }
        }
        touchStartPos = null
    }
}



// new position from mouse event
function setPosition(e) {
    if (e instanceof MouseEvent) {
        pos = new Point2d(e.clientX, e.clientY)
    } else if (e instanceof TouchEvent) {
        if (e.touches.length == 1) {
            pos = touchPos(e)
        }
    }
}

// resize canvas
function resize() {
    ctx.canvas.width = window.innerWidth
    ctx.canvas.height = window.innerHeight
}

let mycanvas = []
let mycanvas_nursery = []
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
            currentPath = [pos]
        }

        ctx.beginPath() // begin


        ctx.lineCap = 'round'
        ctx.linejoin = 'round'
        ctx.strokeStyle = '#c0392b'
        ctx.lineWidth = 3

        ctx.moveTo(pos.x, pos.y) // from
        setPosition(e)
        ctx.lineTo(pos.x, pos.y) // to

        currentPath.push(pos)
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
        // console.log("finish")
        mycanvas_nursery.push(currentPath);
        currentPath = null
        redrawLines()
    }
    if (pointerMode) {
        redrawLines()
    }
}

function clearDrawings() {
    mycanvas = []
    mycanvas_nursery = []
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

function redrawLines() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.beginPath()
    ctx.lineCap = 'round'
    ctx.linejoin = 'round'
    ctx.strokeStyle = '#c0392b'
    ctx.lineWidth = 3

    for (let path of mycanvas_nursery) {
        mycanvas.push(robustFilter(path))
    }

    var p = null;
    for (let path of mycanvas) {
        // console.log(path)
        ctx.moveTo(path[0].x, path[0].y)

        for (var i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y)
        }
    }
    ctx.stroke()
    // redrawPoints()
}

function drawPoint(center, r, color) {
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.arc(center.x, center.y, r, 0, 2 * Math.PI)
    ctx.fill()
}

function drawPoints(points, r, color) {
    for (var i = 0; i < points.length; i++) {
        drawPoint(points[i], r, color)
    }
}

function robustFilter(points, eps) {
    if (eps === undefined) eps = 1.5;

    let splits = splitPointsAway(points)
        .map((split) => filterPoints(split, eps))

    var result = []
    for (var i = 0; i < splits.length; i++) {
        for (var j = 0; j < splits[i].length; j++) {
            if (i != 0 && j == 0) continue
            result.push(splits[i][j])
        }
    }
    return result
}

function redrawPoints() {
    for (let path of mycanvas) {
        drawPoints(path, 3, '#000000')
    }
}

function splitPointsAway(points, eps) {
    if (points.length < 2) {
        return [points]
    }
    if (eps === undefined) {
        eps = .5
    }

    var result = []
    var current = [points[0], points[1]]
    var i = 2
    while (i < points.length) {
        if (current[0].distTo(points[i]) + eps > current[0].distTo(current[current.length-1])) {
            current.push(points[i])
        } else {
            current.push(points[i])
            i++
            if (i < points.length) {
                result.push(current)
                current = [points[i-1], points[i]]
            } else {
                break
            }
        }
        i++
    }
    result.push(current)
    return result;
}



function filterPointsHelper(points, eps, lo, hi, toRemove) {
    //console.log('filterPointsHelper(lo=%s, hi=%s)', lo, hi)
    if (lo + 2 >= hi) return;

    var max_d = -Infinity
    var max_i = undefined
    var line = new Line(points[lo], points[hi-1]);
    for (var i = lo + 1; i < hi - 1; i++) {
        let d = line.perpDist(points[i])
        //console.log(d)
        if (d > max_d) {
            max_d = d
            max_i = i
        }
    }

    if (max_d < eps) {
        for (var i = lo + 1; i < hi - 1; i++) {
            toRemove[i] = true
        }
    } else {
        console.assert(max_i !== undefined, points, lo, hi)
        filterPointsHelper(points, eps, lo, max_i + 1, toRemove)
        filterPointsHelper(points, eps, max_i, hi, toRemove)
    }
}
function filterPoints(points, eps) {
    var toRemove = []
    for (var i = 0; i < points.length; i++) {
        toRemove.push(false);
    }
    filterPointsHelper(points, eps, 0, points.length, toRemove)
    var result = []
    for (var i = 0; i < points.length; i++) {
        if (!toRemove[i]) {
            result.push(points[i])
        }
    }
    return result
}
