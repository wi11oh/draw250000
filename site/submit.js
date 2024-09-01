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

    // 匿名にチェックが入っている場合、90%の確率で作者を"匿名"にする
    const authorName = ((wantAnonym, name) => {
      if (!wantAnonym) return name

      if (Math.random() < 0.1) return name

      return "匿名"
    })(document.querySelector("#anonym").checked, urlParams.get("a"))

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
            id: decodeURIComponent(urlParams.get("msgid")),
            a: authorName,
            text: text,
            spoiler: isSpoiler
        })
    })

    if (r.status == 200) {
        alert("正常送信しました")
    } else {
        alert("ぉゎ〜")
    }
})
