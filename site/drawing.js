document.addEventListener("DOMContentLoaded", async () => {
    const canvas = document.querySelector("#drawingCanvas")
    const context = canvas.getContext("2d")


    console.log(canvas.height)
    let isDrawing = false;
    let lastX = 0
    let lastY = 0

    let color = "#FFFFFF"
    let bolder = 3

    let isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    canvas.addEventListener(isTouchDevice ? "touchstart" : "mousedown", (e) => {
        const { offsetX, offsetY } = sumaho_offset(e, canvas, isTouchDevice)

        color = document.querySelector("#color").value
        bolder = document.querySelector("#bolder").value
        drawLine(offsetX, offsetY, offsetX, offsetY)

        isDrawing = true;
        [lastX, lastY] = [offsetX, offsetY]
    })

    canvas.addEventListener(isTouchDevice ? "touchmove" : "mousemove", (e) => {
        if (isDrawing) {
            color = document.querySelector("#color").value
            bolder = document.querySelector("#bolder").value

            const { offsetX, offsetY } = sumaho_offset(e, canvas, isTouchDevice)

            drawLine(lastX, lastY, offsetX, offsetY)
            lastX = offsetX
            lastY = offsetY

            e.preventDefault()
        }
    })

    canvas.addEventListener(isTouchDevice ? "touchend" : "mouseup", () => {
        isDrawing = false;
    })

    canvas.addEventListener(isTouchDevice ? "touchcancel" : "mouseleave", () => {
        isDrawing = false;
    })

    function sumaho_offset(e, canvas, isTouch) {
        const rect = canvas.getBoundingClientRect()
        const touch = isTouch ? e.touches[0] : e
        const offsetX = touch.clientX - rect.left
        const offsetY = touch.clientY - rect.top
        return { offsetX, offsetY }

    }

    function drawLine(x1, y1, x2, y2) {
        context.strokeStyle = color
        context.lineWidth = bolder
        context.lineCap = "round"
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.stroke()
        context.closePath()
    }
})
