const { contextBridge } = require('electron');
const { AccessToken } = require('livekit-server-sdk');

async function createAccessToken(roomName, participantName) {
    const appKey = 'mycat',
        secretKey = 'mk3ixztvnk3k1kgo0sr1zqh4rb0aqoge';

    const at = new AccessToken(appKey, secretKey, {
        identity: participantName,
    });

    at.addGrant({
        roomJoin: true,
        room: roomName,
        canPublish: true,
        canSubscribe: true,
    });
    return at.toJwt();
}

contextBridge.exposeInMainWorld('electronAPI', {
    createAccessToken,
});

window.addEventListener('DOMContentLoaded', () => {

});

const express = require("express");
const path = require("path");

async function createWebServer() {
    const app = express();
    app.use(express.static(path.resolve(__dirname, "../public")));
    app.use(express.json({}));
    app.use(express.urlencoded({ extended: false }));

    app.post("/createToken", async (req, res) => {
        const { roomName, participantName } = req.body;
        const accessToken = await createAccessToken(roomName, participantName);
        res.send(accessToken);
    });

    app.listen(8080, () => { });
}

createWebServer();
