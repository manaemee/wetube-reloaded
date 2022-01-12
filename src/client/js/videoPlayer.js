const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime"); 
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");


let controlsMovemetTimeout = null;
let controlsTimeout = null;
let volumeValue =  0.5;

const formatTime = (seconds) => new Date(seconds*1000).toISOString().substring(14,19)
const handlePlayClick = () => {
    if(video.paused){
        video.play();
        playBtnIcon.classList = "fas fa-pause";
    }else{
        video.pause();
        playBtnIcon.classList = "fas fa-play";
    }
}

const handleMute = () => {
    if(video.muted){
        video.muted =false;
        muteBtnIcon.classList.remove("fas", "fa-volume-mute");
        muteBtnIcon.classList.add("fas", "fa-volume-up");
    }else{
        video.muted = true;
        muteBtnIcon.classList.add("fas", "fa-volume-mute");
    }
    volumeRange.value = video.muted ? 0 : volumeValue;
};
const handleVolumeChange  = (event) => {
const {value} = event.target;
if(video.muted){
    video.muted = false;
    muteBtn.innerText = "Mute";
}
video.volume = value;
volumeValue =value;
};
const handleLoadedMetadata = () => {
totalTime.innerText = formatTime(Math.floor(video.duration));
timeline.max = Math.floor(video.duration);
};
const handleTimeUpdate = () => {
currentTime.innerText = formatTime(Math.floor(video.currentTime));
timeline.value = video.currentTime;
};
const handleTimeLineChange = (event) => {
const {value} = event.target;
video.currentTime= value;
};
const handleMouseMove = () => {
    if(controlsTimeout){
        clearTimeout(controlsTimeout);
    }
    if(controlsMovemetTimeout){
        clearTimeout(controlsMovemetTimeout);
    }
    videoControls.classList.add("showing");
    controlsMovemetTimeout = setTimeout(()=>{
        videoControls.classList.remove("showing");
    }, 3000);
}
const handleMouseLeave = () => {
    
   controlsTimeout = setTimeout(()=>{
        videoControls.classList.remove("showing");
    }, 3000);
}
const handleVideoClick = () => {
    if(video.paused){
        video.play();
         }else{
        video.pause();
         };
};
const handleFullscreen = () =>{
    const fullscreen = document.fullscreenElement;
    if(fullscreen){
        document.exitFullscreen();
      
        fullScreenIcon.classList = "fas fa-expand";
    }else{
        videoContainer.requestFullscreen();
        fullScreenIcon.classList = "fas fa-compress";
    };
};
document.onfullscreenchange = function () {
    const fullscreen = document.fullscreenElement;
    if(fullscreen){
        fullScreenIcon.classList = "fas fa-compress";
    }else{
        fullScreenIcon.classList = "fas fa-expand";
    };
  };

const handleEnded = () => {
    playBtnIcon.classList = "fas fa-play";
    const { id } = videoContainer.dataset;
    fetch(`/api/videos/${id}/view`, {
      method: "POST",
    });
  };
playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);
timeline.addEventListener("input", handleTimeLineChange);
video.addEventListener("click", handleVideoClick);
fullScreenBtn.addEventListener("click", handleFullscreen);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);

