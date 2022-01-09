

const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream= "";
let recorder = "";
let videoFile = "";


const handleDownlaod = () => {
    const a = document.createElement("a");
    a.href = videoFile;
    a.download = "newrecord.webm";
    document.body.appendChild(a);
    a.click();
}
const handleOnOff = () => {
    if(startBtn.innerText === "Start record"){
        startBtn.innerText = "Stop record";
        recorder = new MediaRecorder(stream);
        recorder.start();
        //ㅁㅣ리보기 + 녹화
    }else{
        startBtn.innerText = "Downlaod record";
        startBtn.removeEventListener("click",handleOnOff);
        recorder.stop();
        recorder.ondataavailable = (e) => {
            videoFile = URL.createObjectURL(e.data);
            video.srcObject=null;
            video.src= videoFile;
            video.loop=true;
            video.play();     
            startBtn.addEventListener("click",handleDownlaod);
    }
        //미리보기+녹화 종료 파일 저장
    }
};
/*const init = async () => {
stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
video.srcObject = stream;
video.play();
}
init();*/

startBtn.addEventListener("click", handleOnOff);