gst-launch-1.0.exe d3d11screencapturesrc monitor-index=0 do-timestamp=true show-cursor=true !  video/x-raw(memory:D3D11Memory), format=BGRA, framerate=60/1 ! d3d11convert ! video/x-raw(memory:D3D11Memory), format=NV12 ! qsvh264enc bitrate=20000 low-latency=true rate-control=cbr gop-size=20 ! video/x-h264,stream-format=byte-stream,profile=baseline ! tcpserversink host=127.0.0.1 port=16400