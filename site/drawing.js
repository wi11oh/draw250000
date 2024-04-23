document.addEventListener("DOMContentLoaded", async () => {
    sessionStorage.clear()

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
        if (isTouchDevice && e.touches.length > 1) {
            saveDraw()
            isDrawing = false;
            if (historyNum > 0) {
                historyNum -= 1
                draw2history()
            }
            return
        }

        if (!(sessionStorage.getItem("history"))) saveDraw()
        const { offsetX, offsetY } = sumaho_offset(e, canvas, isTouchDevice)

        color = document.querySelector("#color").value
        bolder = document.querySelector("#bolder").value
        drawLine(offsetX, offsetY, offsetX, offsetY)

        isDrawing = true;
        [lastX, lastY] = [offsetX, offsetY]

        if (historyNum < history.length - 1) {
            history.splice(historyNum + 1)
        }
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
        saveDraw()
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


    // UNDOで寸分前の過去を帳消す
    let history = []
    let historyNum = -1

    function saveDraw() {
        history.push(canvas.toDataURL())
        historyNum = history.length - 1
        sessionStorage.setItem("history", JSON.stringify(history))
    }

    function draw2history() {
        context.clearRect(0, 0, canvas.width, canvas.height)
        const img = new Image()
        img.src = history[historyNum]
        img.onload = () => {
            context.drawImage(img, 0, 0)
        }
    }

    document.querySelector("#undo").addEventListener("click", (e) => {
        if (historyNum > 0) {
            historyNum -= 1
            draw2history()
        }
    })

    document.querySelector("#redo").addEventListener("click", (e) => {
        if (historyNum < history.length - 1) {
            historyNum += 1
            draw2history()
        }
    })
})
