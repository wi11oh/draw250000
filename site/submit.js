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

    let a = "匿名"
    if (!(document.querySelector("#anonym").checked)) a = urlParams.get("a")

    let text = null
    if (document.querySelector("#msgtext").value) text = document.querySelector("#msgtext").value

    const r = await fetch(`${apiBaseUrl}/submit`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            image: b64,
            id: decodeURIComponent(urlParams.get("msgid")),
            a: a,
            text: text
        })
    })

    if (r.status == 200) {
        alert("正常送信しました")
    } else {
        alert("ぉゎ〜")
    }
})