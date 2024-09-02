document.querySelector("#submit").addEventListener("click", async (e) => {
    const urlParams = new URLSearchParams(window.location.search)

    const sourceCanpas = document.querySelector("#drawingCanvas")
    const submitCanpas = document.createElement("canvas")

    submitCanpas.width = 500
    submitCanpas.height = 500
    submitCanpas.style.display = "none"

    const scaledContext = submitCanpas.getContext("2d")
    scaledContext.drawImage(sourceCanpas, 0, 0, submitCanpas.width, submitCanpas.height)

    const b64 = submitCanpas.toDataURL()
    console.log(b64)

    const isAnonym = document.querySelector("#anonym").checked
    const isSpoiler = document.querySelector("#spoiler").checked

    let text = null
    if (document.querySelector("#msgtext").value) text = document.querySelector("#msgtext").value

    const r = await fetch(`${apiBaseUrl}/submit`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            image: b64,
            uuid: decodeURIComponent(urlParams.get("uuid")),
            text: text,
            anonym: isAnonym,
            spoiler: isSpoiler
        })
    })

    if (r.status == 200) {
        alert("正常送信しました")
    } else {
        alert("ぉゎ〜")
    }
})
