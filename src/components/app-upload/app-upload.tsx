import { Component, h } from "@stencil/core";


@Component({
    tag: "app-upload",
    styleUrl: "app-upload.css",
    shadow: true
})
export class AppUpload {

    onBlur(event) {
        console.log(event.target.files)
        const iceSettings = null;//{ iceServers: [{"urls":["stun:127.0.0.1:59472"]}] }
        let upload = new RTCPeerConnection(iceSettings);
        let uploadChannel = upload.createDataChannel('uploadChannel', {ordered: false, maxRetransmits: 1000});
        uploadChannel.onmessage = function (event) {
            console.log("received", event.data)
        }
        uploadChannel.onopen = _ => {
            uploadChannel.send("ssd")
            console.log("open")
        }
        uploadChannel.onclose = _ => {
            console.log("close")
        }
        console.log(uploadChannel)

        const download = new RTCPeerConnection(iceSettings);
        download.ondatachannel = e => {
            e.channel.onmessage = a => {
                console.log("Data Sending by channel", a.data)
            }
        }

        upload.createOffer().then(data => {
            console.log(data);
            upload.setLocalDescription(data)
            download.setRemoteDescription(data)

            download.createAnswer().then(data => {
                console.log(data);
                download.setLocalDescription(data)
                upload.setRemoteDescription(data)
                console.log('Answer from remoteConnection:\n', data.sdp);
                setInterval(() => {
                    console.log(uploadChannel.readyState)
                }, 1000)
            }).catch(error => {
                console.log(error)
            })
        })

        upload.onicecandidate = e =>{
            console.log("upload candidate", e.candidate)
            !e.candidate || download.addIceCandidate(e.candidate)
        }
        download.onicecandidate = e =>{
            console.log("download candidate", e.candidate)
            !e.candidate || upload.addIceCandidate(e.candidate)
        }

        //let sendChannel = upload.createDataChannel('sendDataChannel', { ordered: true });
        //const localOffer = upload.createOffer();
    }

    componentDidLoad() {

    }

    render() {
        return (<div>
            <h1>Select your files or a folder</h1>
            <img src="/assets/upload.svg" />
            <div>
                <label htmlFor="file">
                    <img src="/assets/add.svg" width="50" />
                </label>
                <input type="file" name="file" id="file" onChange={this.onBlur} />
            </div>
        </div>)
    }
}