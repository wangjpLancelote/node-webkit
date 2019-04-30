// const stream = MediaStream;
function hasUserMedia () {
    //是否支持音频或视频
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);
}
const p = document.getElementById("photo");
const pC = p.getContext('2d');
const v = document.getElementById("video");
const vC = v.getContext('2d');

const deviceArr = [];
const video = document.querySelector('video');
var audio , audioType;

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

//获取源设备的id
// MediaStreamTrack.getSources
MediaStreamTrack.getSources(function (sourceInfos) {
    for (let i in sourceInfos) {
        let sourceInfo = sourceInfos[i];
        if (sourceInfo.kind == 'video') {
            deviceArr.push(sourceInfo.id);
        }
    }
})

function getMedia () {
    if (hasUserMedia()) {
        navigator.getUserMedia({
            'video': {
                'optional': [{
                    'sourceId': deviceArr[0]  //0是前置摄像头，1是后置摄像头
                }]

            },
            'audio': true
        }, successCallBack, errorCallBack);
    } else {
        alert("not support in this browser");
    }
}

function successCallBack (stream) {
    if (video.mozStrObject !== undefined) {
        video.mozStrObject = stream;
    } else {
        video.src = window.URL && window.URL.createObjectURL(stream) || stream;
    }

    //音频处理
    audio = new Audio();
    audioType = getAudioType(audio);
    if (audioType) {
        audio.src = 'polaroid' + audioType;
        audio.play();
    }
}

function errorCallBack (e) {
    alert("error" + e);
}

//将视频绘制到canvas上  这里要保证在60帧以上，否则会感到明显卡顿
function drawVideoAtCanvas (vedio, context) {
    window.setInterval(function () {
        context.drawImage(vedio, 0, 0, 90, 120);
    }, 60);
}

//获取音频格式
function getAudioType (element) {
    if (element.canPlayType) {
        if (element.canPlayType('audio/mp4; codecs="mp4a.40.5') != '') {
            return ('aac');
        } else if (element.canPlayType('audio/ogg; codecs =""vorbis') != '') {
            return ('ogg');
        }
    }
    return false;
}


//拍照
function getPhoto () {
    pC.drawImage(video, 0, 0, 90, 120);
}

//视频
function getVedio () {
    drawVideoAtCanvas(video, vC);
}
// if (hasUserMedia()) {
//     navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
//     navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio : true
//     }).then(stream => {
//         const vedio = document.querySelector("video");
//         video.srcObject = stream;
//     }).catch((err) => {
//         alert("error" + err);
//     })
// }