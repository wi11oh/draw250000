const express = require("express")
const axios = require("axios")

const { Client, GatewayIntentBits, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, spoiler } = require("discord.js")

const fs = require("fs")
const path = require("path")




const discordToken = process.env.DISCORDTOKEN
const channelId = process.env.CHANNELID
const apiBaseUrl = process.env.APIBASEURL




let quoteBase64 = {}




// instanse
const client = new Client({
    intents: Object.values(GatewayIntentBits).reduce((a, b) => a | b)
})

const app = express()
app.use(express.json({ extended: true, limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(express.static("site"))
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))




// discord.js
client.on("ready", () => {
    console.log(`${client.user.tag} > ちっす。`)
})

async function sendMessageToDiscord(author, image, id, text, isSpoiler) {
    const channel = await client.channels.fetch(channelId)
    if (!channel) return
    if (author == "null") author = "匿名"

    const quotebtn = new ButtonBuilder()
        .setCustomId("newbtn")
        .setLabel("新規作成")
        .setStyle(ButtonStyle.Primary)
    const newbtn = new ButtonBuilder()
        .setCustomId("quote")
        .setLabel("この画像を引用して送信")
        .setStyle(ButtonStyle.Danger)
    const row = new ActionRowBuilder().addComponents(quotebtn, newbtn)

    let sendmsg
    if (text) {
        sendmsg = `作者：${author}\n${text}`
    } else {
        sendmsg = `作者：${author}`
    }

    const filename = isSpoiler ? "SPOILER_image.png" : "image.png"

    if (id != "null") {

        const rpmessage = await channel.messages.fetch(id)

        rpmessage.reply({
            content: sendmsg,
            files: [new AttachmentBuilder(image, { name: filename })],
            components: [row],
        })
    } else {
        channel.send({
            content: sendmsg,
            files: [new AttachmentBuilder(image, { name: filename })],
            components: [row],
        })
    }
}

client.on("interactionCreate", async (message) => {
    const a = message.user.globalName
    const msgid = message.message.id

    if (message.customId === "quote") {
        const attachUrl = message.message.attachments.first().url

        const imageb64 = await getb642url(attachUrl)
        quoteBase64[msgid] = imageb64

        const sendmsg = await message.reply({
            content: `15秒後に消えます\n${apiBaseUrl}?quote=true&a=${a}&msgid=${msgid}`,
            ephemeral: true,
        })

        setTimeout(() => {
            sendmsg.delete().catch(console.error)
        }, 15000)
    } else if (message.customId === "newbtn") {
        const sendmsg = await message.reply({
            content: `15秒後に消えます\n${apiBaseUrl}?a=${a}`,
            ephemeral: true
        })

        setTimeout(() => {
            sendmsg.delete().catch(console.error)
        }, 15000)
    }
})

async function getb642url(url) {
    const r = await axios.get(url, {
        responseType: "arraybuffer"
    })

    return Buffer.from(r.data, "binary").toString("base64")
}

client.login(discordToken)




// express
const allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE")
    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, access_token"
    )
    if ("OPTIONS" === req.method) {
        res.send(200)
    } else {
        next()
    }
}
app.use(allowCrossDomain)

app.get("/", function (req, res) {
    res.render(
        "index",
        {
            apiBaseUrl: `<script>window.apiBaseUrl = "${apiBaseUrl}"</script>`,
        }
    )
})

app.post("/submit", function (req, res) {
    const image_ = req.body.image
    const id = req.body.id
    const a = req.body.a
    const text = req.body.text
    const isSpoiler = req.body.spoiler
    console.log(id, a)

    const image = Buffer.from(image_.replace(/^data:image\/\w+;base64,/, ''), "base64")

    if (image_) {
        sendMessageToDiscord(a, image, id, text, isSpoiler)
        res.status(200).send("OK")
    } else {
        res.status(400).send("ぅゎ〜〜〜〜〜〜〜〜〜")
    }
})

app.get("/insert", (req, res) => {
    res.send(quoteBase64[req.query.msgid])
    // デバッグ後必ずコメントアウト！！！！！！！！！！！！
    quoteBase64 = {}
})

app.listen(3000, () => {
    console.log("Express server is running on port 3000")
})
