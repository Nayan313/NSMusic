let playBtn = document.querySelectorAll(".playBtn");
let pauseBtn = document.querySelectorAll(".pauseBtn");
let prev = document.querySelectorAll(".prev");
let next = document.querySelectorAll(".next");

function PauseFn() {
  pauseBtn.forEach((pauseBtnAction, index) => {
    pauseBtnAction.addEventListener("click", () => {
      audioPlayer.pause();
      playBtn.forEach((e)=>{e.style.display = "block";})
      pauseBtn.forEach((e)=>{e.style.display = "none";})
    });
  });
}
function PlayFn() {
  playBtn.forEach((playBtnAction, index) => {
    playBtnAction.addEventListener("click", () => {
      audioPlayer.play();
      playBtn.forEach((e)=>{e.style.display = "none";})
      pauseBtn.forEach((e)=>{e.style.display = "block";})
    });
  });
}
PauseFn();
PlayFn();

prev.forEach((action) => {
  action.addEventListener("click", () => {
    SongCurrentIndex--;
    let fil = playlistArr.filter((e)=> e.PlaylistId == SongPlaylistId )
    let playArr = []
    for(a of fil){
      playArr.push(a.SongData)
    }
    if (SongCurrentIndex < 0) {
      SongCurrentIndex = playArr.length - 1;
    }
    let SongLink = playArr[SongCurrentIndex];
    UpdateSongInfo(SongLink);
  });
});
next.forEach((action) => {
  action.addEventListener("click", () => {
    SongCurrentIndex++;
    let fil = playlistArr.filter((e)=> e.PlaylistId == SongPlaylistId )
    let playArr = []
    for(a of fil){
      playArr.push(a.SongData)
    }
    if (SongCurrentIndex >= playArr.length) {
      SongCurrentIndex = 0;
    }
    let SongLink = playArr[SongCurrentIndex];
    UpdateSongInfo(SongLink);
    // console.log("CurrentIndexIsThe" + SongCurrentIndex);
  });
});

audioPlayer.addEventListener("ended", () => {
  SongCurrentIndex++;
    let fil = playlistArr.filter((e)=> e.PlaylistId == SongPlaylistId )
    let playArr = []
    for(a of fil){
      playArr.push(a.SongData)
    }
    if (SongCurrentIndex >= playArr.length) {
      SongCurrentIndex = 0;
    }
    let SongLink = playArr[SongCurrentIndex];
    UpdateSongInfo(SongLink);
});

let seekControls = document.querySelectorAll(".seekControl");
let seek = document.querySelectorAll(".seek");
let dot = document.querySelectorAll(".dot");
let currentTime = document.querySelectorAll(".current");
let durationTime = document.querySelectorAll(".duration");
let soundSeekControls = document.querySelectorAll(".soundSeekControl");
let soundSeeks = document.querySelectorAll(".soundSeek");

let Player  =  document.querySelector(".player");
audioPlayer.addEventListener("timeupdate", () => {
  let musicDuration = audioPlayer.duration;
  let currentMusic = audioPlayer.currentTime;
  let width = (currentMusic / musicDuration) * 100;
  let progressBar = parseInt((currentMusic / musicDuration) * 100);
let layout = document.querySelector(".layout");
  // Update all seek controls
  Player.classList.add("playerActive")
  layout.classList.add("LayoutActive")
  seekControls.forEach((seekControl) => (seekControl.value = progressBar));
  seek.forEach((seekAction) => (seekAction.style.width = `${width}%`));
  dot.forEach((dotAction) => (dotAction.style.left = `${width}%`));

  // Update current time and duration displays
  let durationMin = Math.floor(musicDuration / 60);
  let durationSec = Math.floor(musicDuration % 60);
  let currentMin = Math.floor(currentMusic / 60);
  let currentSec = Math.floor(currentMusic % 60);

  if (durationSec < 10) durationSec = `0${durationSec}`;
  if (currentSec < 10) currentSec = `0${currentSec}`;

  currentTime.forEach((timeUpdate) => {
    timeUpdate.innerHTML = `${currentMin}:${currentSec}`;
  });
  durationTime.forEach((timeUpdate) => {
    timeUpdate.innerHTML = `${durationMin}:${durationSec}`;
  });
});

// Add event listener for seek controls
seekControls.forEach((seekControl) => {
  seekControl.addEventListener("input", () => {
    let value = seekControl.value;
    audioPlayer.currentTime = (value / 100) * audioPlayer.duration;
    // Update all seek controls to match the new value
    seekControls.forEach((control) => (control.value = value));
  });
});

// Add event listener for sound seek controls
soundSeekControls.forEach((soundSeekControl) => {
  soundSeekControl.addEventListener("input", () => {
    let value = soundSeekControl.value;
    audioPlayer.volume = value / 100;
    // Update all sound seek controls to match the new value
    soundSeekControls.forEach((control) => (control.value = value));
    soundSeeks.forEach((seek) => (seek.style.width = `${value}%`));
  });
});

// Initial volume setup
soundSeekControls.forEach((control) => {
  control.value = audioPlayer.volume * 100;
});
soundSeeks.forEach((seek) => {
  seek.style.width = `${audioPlayer.volume * 100}%`;
});

soundSeekControls.forEach((soundSeekControl) => {
  soundSeekControl.addEventListener("change", () => {
    let value = soundSeekControl.value;

    soundSeekControls.forEach((control) => {
      control.value = value;
    });

    soundSeeks.forEach((seek) => {
      seek.style.width = `${value}%`;
    });
  });
});






let SongName = document.querySelectorAll(".player-song-name");
let ArtistName = document.querySelectorAll(".player-artist-name");
let PosterImg = document.querySelectorAll(".img");
async function UpdateSongInfo(SongLink, PlaylistId,ClickedPlayListSong) {
  audioPlayer.pause();
  const url = SongLink.downloadUrl[4].url;
  // console.log("SongLink");
  // console.log("SongLink");
  // console.log("SongLink");
  // console.log(SongLink);
document.title = SongLink.name + " | Nayan Sukhadiya"
  audioPlayer.src = url;
  SongName.forEach((update) => {
    update.innerHTML = SongLink.name;
  });
  let ArtistNameArr = [];
  for (a of SongLink.artists.primary) {
    ArtistNameArr.push(a.name);
  }
  
  try {
    const artistImgElement = document.querySelector(".PrimaryArtistImg");
    artistImgElement.onerror = function() {
        this.onerror = null;
        this.src = './img/poster.jpg';
    };
    artistImgElement.src = SongLink.artists.primary[0].image[2].url;
} catch (error) {
    console.error('Error setting the artist image:', error);
    const artistImgElement = document.querySelector(".PrimaryArtistImg");
    artistImgElement.src = './img/user.jpg';
}
document.querySelector(".PrimaryArtistName").innerHTML = SongLink.artists.primary[0].name;

if(SongLink.playCount === null || undefined){
  document.querySelector(".playCount").innerHTML = "Not Found";
}else{
  document.querySelector(".playCount").innerHTML = SongLink.playCount.toLocaleString("en-IN");
}

document.querySelector(".labelDeepDetail").innerHTML = SongLink.label;
document.querySelector(".AlbumNameDeepDetail").innerHTML = SongLink.album.name;
  ArtistName.forEach((updateArtist) => {
    updateArtist.innerHTML = ArtistNameArr.toLocaleString();
  });
  PosterImg.forEach((updateImg) => {
    updateImg.src = SongLink.image[1].url;
  });
  playBtn.forEach((e) => {
    e.style.display = "none";
  });
  pauseBtn.forEach((e) => {
    e.style.display = "block";
  });
  audioPlayer.play();
  imgEl.crossOrigin = "anonymous";
  imgEl.onload = function () {
    applyAverageColor(imgEl);
  };
  let backBlur = document.querySelectorAll(".backdrop");
  let PopUp = document.querySelector(".pop-up");

  if (PopUp.classList.contains("pop-upAnim")) {
    PopUp.classList.remove("pop-upAnim");
    // Trigger a reflow to restart the animation
    void PopUp.offsetWidth;
    PopUp.classList.add("pop-upAnim");
  } else {
    PopUp.classList.add("pop-upAnim");
  }
  SongId = SongLink.id;
  backBlur.forEach((e) => {
    e.src = `${SongLink.image[2].url}`;
  });
  imgEl.src = SongLink.image[2].url;
}

function getAverageRGB(imgEl) {
  var blockSize = 5,
    defaultRGB = { r: 0, g: 0, b: 0 },
    canvas = document.createElement("canvas"),
    context = canvas.getContext && canvas.getContext("2d"),
    data,
    width,
    height,
    i = -4,
    length,
    rgb = { r: 0, g: 0, b: 0 },
    count = 0;

  if (!context) {
    console.error("Canvas context not supported.");
    return defaultRGB;
  }

  height = canvas.height =
    imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
  width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

  context.drawImage(imgEl, 0, 0, width, height);

  try {
    data = context.getImageData(0, 0, width, height);
  } catch (e) {
    console.error("Error accessing image data:", e);
    return defaultRGB;
  }

  length = data.data.length;

  while ((i += blockSize * 4) < length) {
    count++;
    rgb.r += data.data[i];
    rgb.g += data.data[i + 1];
    rgb.b += data.data[i + 2];
  }

  rgb.r = Math.floor(rgb.r / count);
  rgb.g = Math.floor(rgb.g / count);
  rgb.b = Math.floor(rgb.b / count);

  return rgb;
}

function applyAverageColor(imgEl) {
  var rgb = getAverageRGB(imgEl);
  document.documentElement.style.setProperty(
    "--poster-average-color",
    `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
  );
}

let FullScreen = document.querySelector(".fullScreenPlayer");

document.querySelector(".minPlayer").addEventListener("click", () => {
  FullScreen.classList.remove("fullScreenPlayerActive")
});
document.querySelector(".maxPlayer").addEventListener("click", () => {
  FullScreen.classList.add("fullScreenPlayerActive")
});

if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
  Player.classList.add("mobilePlayer")
}
document.querySelector(".touchSongDetail").addEventListener("click", ()=>{
  FullScreen.classList.add("fullScreenPlayerActive")
})