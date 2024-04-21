document.addEventListener("DOMContentLoaded", async () => {
    const canvas = document.querySelector("#drawingCanvas")
    const context = canvas.getContext("2d")
    let savedImageData = null

    const urlParams = new URLSearchParams(window.location.search)
    const quote = decodeURIComponent(urlParams.get("quote"))
    const msgid = decodeURIComponent(urlParams.get("msgid"))

    async function getb64(url) {
        const request = await fetch(url)
        return await request.text()
    }

    async function loadAndDrawImage() {
        const b64Image = await getb64(`${apiBaseUrl}/insert?msgid=${msgid}`)
        const image = new Image()
        image.onload = () => {
            context.drawImage(image, 0, 0, 500, 500, 0, 0, canvas.width, canvas.height)
        };
        image.src = "data:image/jpeg;base64," + b64Image
    }

    if (quote === "true") {
        await loadAndDrawImage()
    }

    function setCanvasSize() {
        if (canvas.width > 0 && canvas.height > 0) {
            savedImageData = context.getImageData(0, 0, canvas.width, canvas.height)
        }

        const size = Math.min(window.innerWidth, window.innerHeight)
        canvas.width = size
        canvas.height = size

        if (savedImageData) {
            context.putImageData(savedImageData, 0, 0)
        } else {
            if (quote === "true") {
                loadAndDrawImage()
            }
        }
    }

    setCanvasSize()

    window.addEventListener("resize", setCanvasSize)
});
