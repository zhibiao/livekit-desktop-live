
const localVideo = document.getElementById("localVideo"),
    publishButton = document.getElementById("publish"),
    unpublishButton = document.getElementById("unpublish"),
    connectButton = document.getElementById("connect"),
    disconnectButton = document.getElementById("disconnect");

let livekitRoom = null;

connectButton.addEventListener("click", async () => {
    const roomOptions = {
        adaptiveStream: false,
        dynacast: false,
        videoCaptureDefaults: {},
    };

    livekitRoom = new LivekitClient.Room(roomOptions);

    const roomName = 'mycat-room',
        participantName = 'mycat/publisher';

    const livekitToken = await electronAPI.createAccessToken(roomName, participantName),
        livekitServer = "ws://127.0.0.1:7880";

    console.log("RoomName:", roomName);
    console.log("ParticipantName:", participantName);
    console.log("Token:", livekitToken)
    console.log("Server:", livekitServer);

    const roomConnectOptions = {
        autoSubscribe: false,
    };

    await livekitRoom.connect(livekitServer, livekitToken, roomConnectOptions);
    console.log("Connected");

    livekitRoom
        .on(LivekitClient.RoomEvent.TrackSubscribed, handleTrackSubscribed)
        .on(LivekitClient.RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed)

        .on(LivekitClient.RoomEvent.ActiveSpeakersChanged, handleActiveSpeakerChange)

        .on(LivekitClient.RoomEvent.Connected, handleConnect)
        .on(LivekitClient.RoomEvent.Disconnected, handleDisconnect)

        .on(LivekitClient.RoomEvent.TrackPublished, handleTrackPublished)
        .on(LivekitClient.RoomEvent.TrackUnpublished, handleTrackUnpublished)

        .on(LivekitClient.RoomEvent.LocalTrackPublished, handleLocalTrackPublished)
        .on(LivekitClient.RoomEvent.LocalTrackUnpublished, handleLocalTrackUnpublished);
});

disconnectButton.addEventListener("click", async () => {

});

publishButton.addEventListener("click", async () => {
    const publishOptions = {
        videoCodec: "h264",
        VideoEncoding: {
            maxBitrate: 8000 * 1000,
            maxFramerate: 60,
        }
    };

    /*
    const videoCaptureOptions = {
        resolution: {
            width: 1280,
            height: 720,
            frameRate: 30
        }
    };

    await livekitRoom.localParticipant.setCameraEnabled(
        true,
        videoCaptureOptions,
        publishOptions);
    */

    const localStream = await getLocalStream();
    livekitRoom.localParticipant.publishTrack(localStream.getVideoTracks()[0], publishOptions);
});

unpublishButton.addEventListener("click", async () => {
});

async function handleConnect() {
    console.log("Connected.");
}

async function handleTrackSubscribed(track, publication, participant) {
    console.log("TrackSubscribed\n");
}

async function handleTrackUnsubscribed(track, publication, participant) {
    console.log("TrackUnsubscribed\n");
}

async function handleActiveSpeakerChange(speakers) { }

async function handleDisconnect() {
    console.log("Disconnect\n");
}

async function handleTrackUnpublished(publication, participant) {
    console.log("TrackUnpublished\n");
}

async function handleTrackPublished(publication, participant) {
    console.log("TrackPublished\n");
}

async function handleLocalTrackUnpublished(track, participant) {
    console.log("LocalTrackUnpublished\n");
}

async function handleLocalTrackPublished(track, participant) {
    console.log("LocalTrackPublished\n");
}

async function getLocalStream() {
    const constraints = {
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                minWidth: 1920,
                maxWidth: 1920,
                minHeight: 1080,
                maxHeight: 1080,
                maxFrameRate: 60,
                minFrameRate: 60,
            }
        }
    }
    return navigator.mediaDevices.getUserMedia(constraints);
}