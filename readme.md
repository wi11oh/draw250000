# draw250000
## 概要
これはdiscordボットです。

## ローカルテスト方法
1. discord dev account 取得
2. [bot作成](https://discord.com/developers/applications) -> New Application ->  
   -> Bot -> TOKEN(Reset token) : 覚える  
   -> Bot -> PUBLIC BOT : OFF  
   -> Bot -> Privileged Gateway Intents : 3つともON
3. OAuth2-> OAuth2 URL Generator -> SCOPES : botをチェック  
   -> GENERAL PERMISSIONS : Administratorをチェック(めんどいので)  
   -> GENERATED URL : コピーして移動
   -> 招待画面 : お好きなテスト鯖に招待
4. clone
    ```shell
    git clone https://github.com/wi11oh/draw250000.git
    ```
5. 直下 .env 作成
    ```shell
    cd draw250000
    touch .env
    ```
6. .env 編集
    ```env
    DISCORDTOKEN = ~~~~~~~~~~~~~~~~~~~~ // 2. で出たやつ
    CHANNELID = ~~~~~~~~~~~~~~~~~~~~~~ // 動かしたいディスコのchannelId
    APIBASEURL = http://~~~~~~~~ // 自IP
    ```
7. 実行
    ```shell
    npm install
    node --env-file=.env main.js
    ```