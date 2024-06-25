let playlistArr = [];
const audioPlayer = new Audio();
let SongPlaylistSection = document.querySelector(".Song-Playlist-section");
let ClickedPlayListSong = [];
let imgEl = new Image();
let songId = "";
let SongPlaylistId = "";
let SongCurrentIndex;

let totalDuration = 0;
let totalDurationFormatted = 0;

function TotalTimeCount(...num) {
  let sum = 0;
  for (a of num) {
    sum += a;
  }

  return sum;
}

function convertToHHMMSS(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const paddedMinutes = minutes.toString().padStart(2, "0");
  const paddedSeconds = remainingSeconds.toString().padStart(2, "0");

  if (hours > 0) {
    const paddedHours = hours.toString().padStart(2, "0");
    return `${paddedHours}h : ${paddedMinutes}m : ${paddedSeconds}s`;
  } else {
    return `${paddedMinutes}m : ${paddedSeconds}s`;
  }
}
async function homePage() {
  let PlaylistId = "";
  let PlaylistLimit = "";
  let AlbumFetchName = "";
  let Arr = [
    { html: "TazaTune", js: "Taza Tune" },
    { html: "Romantic", js: "Romantic Top 40" },
    { html: "pop", js: "Pop Mein Top" },
    { html: "nach", js: "Nach Le" },
    { html: "Ishqiyaan", js: "Ishqiyaan" },
  ];

  for (let arrayObject of Arr) {
    fetch(`https://saavn.dev/api/search/playlists?query=new`)
      .then((res) => res.json())
      .then((playlistData) => {
        const TrendingToday = playlistData.data.results.filter(
          (obj) => obj.name === arrayObject.js
        );
        console.log(TrendingToday);
        if (TrendingToday.length === 0) {
          PlaylistId = playlistData.data.results[0].id;
          PlaylistLimit = playlistData.data.results[0].songCount;
        } else {
          PlaylistId = TrendingToday[0].id;
          PlaylistLimit = TrendingToday[0].songCount;
        }
        AlbumFetchName = arrayObject.html;
        console.log(AlbumFetchName);
        PlaylistGet(PlaylistId, PlaylistLimit, AlbumFetchName);
      });
  }
}
homePage();
async function ns() {
  const response = await fetch(
    "https://saavn.dev/api/search/playlists?query=romantic"
  );
  const playlistData = await response.json();
  let arr2 = [];
  let PlayListCard = ``;

  for (let playlist of playlistData.data.results) {
    arr2.push(playlist);

    PlayListCard += `
    <div class="playlistCard">
    <h4 class="playlist-name">${playlist.name}</h4></div>
    `;
  }
  document.querySelector(".Playlist-card-section").innerHTML = PlayListCard;

  let playlistCards = document.querySelectorAll(".playlistCard");

  playlistCards.forEach((card) => {
    card.addEventListener("click", async () => {
      const playlistName = card.querySelector(".playlist-name").innerText;
      console.log(playlistName);
      const PlaylistIdGet = arr2.filter((obj) => obj.name === playlistName);
      console.log(PlaylistIdGet);
      const PlaylistId = PlaylistIdGet[0].id;
      const PlaylistBackImg = PlaylistIdGet[0].image[2].url;
      const PlaylistName = PlaylistIdGet[0].name;
      const PlaylistType = PlaylistIdGet[0].type;
      imgEl.src = PlaylistIdGet[0].image[2].url;
      imgEl.crossOrigin = "anonymous";
      imgEl.onload = function () {
        applyAverageColor(imgEl);
      };
      const PlaylistLimit = PlaylistIdGet[0].songCount;
      const AlbumFetchName = "PlaylistSongs";

      const SectionButtons = document.querySelectorAll(".SidebarButtons");

      SectionButtons.forEach((btn) => btn.classList.remove("active"));
      let OpenPlaylist = document.querySelectorAll("#OpenPlaylist");
      OpenPlaylist.forEach((e) => e.classList.add("active"));
      document.querySelector(".Home-content").style.display = "none";
      document.querySelector(".Explore-section").style.display = "none";
      document.querySelector(".Trending-section").style.display = "none";
      document.querySelector(".Artist-section").style.display = "none";
      document.querySelector(".Album-section").style.display = "none";
      document.querySelector(".CurrentPlaylist-section").style.display =
        "block";
      await PlaylistAlbumLoad(
        PlaylistId,
        PlaylistLimit,
        AlbumFetchName,
        PlaylistBackImg,
        PlaylistName,
        PlaylistType
      );
    });
  });

  return arr2;
}
ns();

async function PlaylistGet(
  PlaylistId,
  PlaylistLimit,
  AlbumFetchName,
  PlaylistBackImg,
  PlaylistName,
  PlaylistType
) {
  fetch(
    `https://saavn.dev/api/playlists?id=${PlaylistId}&limit=${PlaylistLimit}`
  )
    .then((res) => res.json())
    .then((data) => {
      let SongCard = "";
      let ClickedPlayListSong = [];
      SongPlaylistId = PlaylistId;
      let songs = data.data.songs;
      let limit = Math.min(PlaylistLimit, songs.length - 1);

      document.querySelector(".ShawPlayBack").src = PlaylistBackImg;
      document.querySelector(".headerType").innerText = PlaylistType;
      document.querySelector(".headerName").innerText = PlaylistName;

      for (let a = 0; a <= limit; a++) {
        playlistArr.push({ PlaylistId: PlaylistId, SongData: songs[a] });
        ClickedPlayListSong.push({
          PlaylistId: PlaylistId,
          SongData: songs[a],
        });

        SongCard += `
          <div id="${songs[a].id}" class="songCard PlaySong">
            <h1 class="TrendNumber">${a + 1}</h1>
            <img class="SongPoster" src="${songs[a].image[2].url}" alt="">
            <div class="songDetail">
              <h4 class="SongName">${songs[a].name}</h4>
              <h5>${songs[a].album.name}</h5>
            </div>
          </div>`;
      }
      document.querySelector(`.${AlbumFetchName}`).innerHTML = SongCard;
      PlaySongs(data, SongPlaylistId, ClickedPlayListSong);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

async function PlaySongs(data, SongPlaylistId, ClickedPlayListSong) {
  let SongCards = document.querySelectorAll(".PlaySong");

  SongCards.forEach((card) => {
    card.addEventListener("click", (event) => {
      const SongId = event.currentTarget.id;
      console.log(SongId);
      const SongData = data.data.songs.filter((obj) => obj.id === SongId);
      let PlaylistId = SongPlaylistId;
      const SongPlaylistDataId = ClickedPlayListSong.filter(
        (obj) => obj.PlaylistId === SongPlaylistId
      );
      console.log(SongPlaylistDataId);
      console.log("Song dta");
      let SongLink = SongData[0];
      console.log(SongLink);
      const url = SongLink.downloadUrl[4].url;
      let FindIn = ClickedPlayListSong.findIndex(
        (obj) => obj.SongData.id === SongId && obj.PlaylistId === SongPlaylistId
      );
      console.log("SongCurrentIndex" + FindIn);
      SongCurrentIndex = FindIn;
      audioPlayer.src = url;
      UpdateSongInfo(SongLink, PlaylistId, ClickedPlayListSong);
      queueSong(ClickedPlayListSong, SongId, PlaylistId);
    });
  });
}

async function PlaylistAlbumLoad(
  PlaylistId,
  PlaylistLimit,
  AlbumFetchName,
  PlaylistBackImg,
  PlaylistName,
  PlaylistType
) {
  fetch(
    `https://saavn.dev/api/playlists?id=${PlaylistId}&limit=${PlaylistLimit}`
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      let SongCard = "";
      let ClickedPlayListSong = [];
      SongPlaylistId = PlaylistId;
      let songs = data.data.songs;
      console.log(songs[0].id);
      let limit = Math.min(PlaylistLimit, songs.length - 1);
      document.querySelector(".ShawPlayBack").src = PlaylistBackImg;
      document.querySelector(".AlbumFirstImg").src = songs[0].image[2].url;
      document.querySelector(".headerType").innerText = PlaylistType;
      document.querySelector(".headerName").innerText = PlaylistName;
      for (a of songs) {
        playlistArr.push({
          PlaylistId: PlaylistId,
          SongData: a,
        });
        ClickedPlayListSong.push({
          PlaylistId: PlaylistId,
          SongData: a,
        });
        let ArtistNameArr = [];
        for (av of a.artists.primary) {
          ArtistNameArr.push(av.name);
        }
        let ArtistString = ArtistNameArr.toLocaleString();
        let dur = convertToHHMMSS(`${a.duration}`);
        SongCard += `
                    <div id="${a.id}"  class="AlbumPlaylistSongCard PlaySong">
                    <div class="inner-card">
                        <div class="Albumimg-section">
                            <img class="img" crossorigin="anonymous" src="${a.image[2].url}" alt="">
                        </div>
                        <div class="nameAndArtist">
                        <h4>${a.name}</h4>
                        <h5>${ArtistString}</h5>
                    </div>
                    <div class="Album">
                       ${a.album.name}
                        </div>
                        <div class="duration">
                        ${dur}
                        </div>
                    </div>
                    <div class="seek" id="seek"></div>
                </div>`;
      }
      document.querySelector(`.AlbumCardSection`).innerHTML = SongCard;

      PlaySongs(data, SongPlaylistId, ClickedPlayListSong);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

// --------------------------- search bar ----------------

let SearchBar = document.querySelector("#SearchBar");

const buttons = document.querySelectorAll(".searchFilter button");

buttons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const sectionName = event.currentTarget.className;
    showSection(sectionName);
    buttons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
  });
});

function showSection(sectionName) {
  document.querySelectorAll(".searchSubSection").forEach((section) => {
    section.classList.remove("active");
  });
  document.querySelector(`.${sectionName}-section`).classList.add("active");
}

SearchBar.addEventListener("input", () => {
  let query = capitalizeFLetter(SearchBar.value);
  function capitalizeFLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  fetch(`https://saavn.dev/api/search/artists?query=${query}&limit=50`)
    .then((res) => res.json())
    .then((SearchData) => {
      let ArtistSearchArr = [];
      for (arr of SearchData.data.results) {
        ArtistSearchArr.push(arr);
      }
      ArtistSearchListArr(ArtistSearchArr);
    });
  fetch(`https://saavn.dev/api/search/playlists?query=${query}&limit=50`)
    .then((res) => res.json())
    .then((data) => {
      let PlayListSearchArr = [];
      for (arr of data.data.results) {
        PlayListSearchArr.push(arr);
      }

      PlaylistSearchListArr(PlayListSearchArr);
    });
  fetch(`https://saavn.dev/api/search/albums?query=${query}&limit=50`)
    .then((res) => res.json())
    .then((data) => {
      let AlbumSearchArr = [];
      for (arr of data.data.results) {
        AlbumSearchArr.push(arr);
      }

      AlbumSearchListArr(AlbumSearchArr);
    });

  SongSearchListArr(query);
});

async function SongSearchListArr(query) {
  fetch(`https://saavn.dev/api/search/songs?query=${query}&limit=50`)
    .then((res) => res.json())
    .then((data) => {
      let dataPath = data.data.results;
      let SearchSongCard = ``;
      SongPlaylistId = "SongSearchPlaylist";
      ClickedPlayListSong.length = 0;
      if (data.success === false) {
        SearchSongCard = "<p>No Song Found</p>";
      } else {
        for (card of data.data.results) {
          playlistArr.push({
            PlaylistId: "SongSearchPlaylist",
            SongData: card,
          });
          ClickedPlayListSong.push({
            PlaylistId: "SongSearchPlaylist",
            SongData: card,
          });
          SearchSongCard += `<div id=${card.id} class="searchCard SongPlayCard SongCard AlbumCard">
      <img src="${card.image[2].url}" alt="">
      <h4>${card.name}</h4>
  </div>`;
        }
      }
      document.querySelector(".song-section").innerHTML = SearchSongCard;
      AlbumPlay(data, SongPlaylistId, ClickedPlayListSong, dataPath);
    });
}
async function AlbumPlay(data, SongPlaylistId, ClickedPlayListSong, dataPath) {
  let SongCards = document.querySelectorAll(".SongPlayCard");

  SongCards.forEach((card) => {
    card.addEventListener("click", (event) => {
      const SongId = event.currentTarget.id;
      console.log("SongId is " + SongId);
      console.log(ClickedPlayListSong);
      const SongPlaylistDataId = playlistArr.filter(
        (obj) => obj.PlaylistId === "SongSearchPlaylist"
      );
      const SongDatas = SongPlaylistDataId.filter(
        (obj) => obj.SongData.id === SongId
      );
      console.log("Filtered SongData:", SongDatas);
      console.log(SongPlaylistId);
      console.log(SongDatas);
      console.log(ClickedPlayListSong);
      let PlaylistId = SongPlaylistId;
      console.log(SongPlaylistDataId);
      console.log("Song dta");
      let SongLink = SongDatas[0].SongData;
      console.log(SongLink);
      const url = SongLink.downloadUrl[4].url;
      let FindIn = ClickedPlayListSong.findIndex((obj) => obj.id == SongId);
      FindIn = FindIn + 1;
      console.log("SongCurrentIndex" + FindIn);
      SongCurrentIndex = FindIn;
      audioPlayer.src = url;
      console.log(ClickedPlayListSong);
      UpdateSongInfo(SongLink, PlaylistId, ClickedPlayListSong);
    });
  });
}
async function ArtistSearchListArr(ArtistSearchArr) {
  let ArtistSongCard = ``;
  if (ArtistSearchArr.length == 0) {
    ArtistSongCard = "<p>No Artist Found</p>";
  } else {
    for (card of ArtistSearchArr) {
      ArtistSongCard += `<div id=${card.id} class="searchCard ArtistCard">
      <img src="${card.image[2].url}" alt="">
      <h4>${card.name}</h4>
      <h5>${card.role}</h5>
  </div>`;
    }
  }
  document.querySelector(".artist-section").innerHTML = ArtistSongCard;
  ArtistProfile();
}

async function AlbumSearchListArr(AlbumSearchArr) {
  let AlbumSongCard = ``;
  if (AlbumSearchArr.length == 0) {
    AlbumSongCard = "<p>No Album Found</p>";
  } else {
    for (card of AlbumSearchArr) {
      AlbumSongCard += `<div id=${card.id} class="searchCard AlbumCard PlaySong">
      <img src="${card.image[2].url}" alt="">
      <h4>${card.name}</h4>
  </div>`;
    }
  }
  document.querySelector(".album-section").innerHTML = AlbumSongCard;
  AlbumList();
}
async function PlaylistSearchListArr(PlayListSearchArr) {
  let PlaylistSearchSongCard = ``;
  if (PlayListSearchArr.length == 0) {
    PlaylistSearchSongCard = "<p>No Album Found</p>";
  } else {
    for (card of PlayListSearchArr) {
      PlaylistSearchSongCard += `<div id="${card.id}" data-count="${card.songCount}" class="searchCard PlaylistSearchCard PlaySong">
      <img src="${card.image[2].url}" alt="">
      <h4>${card.name}</h4>
  </div>`;
    }
  }
  document.querySelector(".playlist-section").innerHTML =
    PlaylistSearchSongCard;
  PlaylistSearchList();
}

async function ArtistProfile() {
  let ArtistCards = document.querySelectorAll(".ArtistCard");

  ArtistCards.forEach((card) => {
    card.addEventListener("click", (event) => {
      const ArtistId = event.currentTarget.id;

      fetch(`https://saavn.dev/api/artists/${ArtistId}`)
        .then((res) => res.json())
        .then((data) => {
          ClickedPlayListSong.length = 0;
          for (a of data.data.topSongs) {
            ClickedPlayListSong.push({ PlaylistId: ArtistId, SongData: a });
            playlistArr.push({ PlaylistId: ArtistId, SongData: a });
          }

          console.log(data);
          hideAllSections();
          let SongPlaylistId = ArtistId;
          console.log(SongPlaylistId);
          document.querySelector(".Artist-section").style.display = "block";

          let ArtistImages = document.querySelectorAll(".ArtistImg");
          ArtistImages.forEach((img) => {
            img.src = data.data.image[2].url;
          });
          document.querySelector(".ArtistSectionName").innerHTML =
            data.data.name;
          let dataPath = data.data.topSongs;
          let ArtistCard = ``;
          for (a of data.data.topSongs) {
            totalDuration += a.duration;
            totalDurationFormatted = convertToHHMMSS(totalDuration);
            ArtistCard += `
            <div id="${a.id}"  class="artistSongCard AlbumPlayCard">
                        <img src="${a.image[2].url}" alt="">
                    <p class="name">${a.name}</p>
                    <h5 class="album">${a.album.name}</h5>
                    </div>`;
          }

          document.querySelector(".ArtistSong-section").innerHTML = ArtistCard;
          console.log(ClickedPlayListSong);
          console.log(totalDurationFormatted);
          document.querySelector(".TotalTimeOfDuration").innerHTML =
            "Total Play time: " + totalDurationFormatted;
          AlbumPlay2(data, SongPlaylistId, ClickedPlayListSong, dataPath);
        });
    });
  });
}
async function PlaylistSearchList() {
  let PlaylistSearchCards = document.querySelectorAll(".PlaylistSearchCard");

  PlaylistSearchCards.forEach((card) => {
    card.addEventListener("click", (event) => {
      const PlaylistId = event.currentTarget.id;
      const dataCount = event.currentTarget.getAttribute("data-count");
      fetch(
        `https://saavn.dev/api/playlists?id=${PlaylistId}&limit=${dataCount}`
      )
        .then((res) => res.json())
        .then((data) => {
          hideAllSections();
          document.querySelector(".Artist-section").style.display = "block";
          let dataPath = data.data.songs;
          let ArtistImages = document.querySelectorAll(".ArtistImg");
          ArtistImages.forEach((img) => {
            img.src = data.data.image[2].url;
          });
          document.querySelector(".ArtistSectionName").innerHTML =
            data.data.name;
          ClickedPlayListSong.length = 0;
          let SongPlaylistId = PlaylistId;
          let ArtistCard = ``;
          for (card of data.data.songs) {
            playlistArr.push({ PlaylistId: SongPlaylistId, SongData: card });
            ClickedPlayListSong.push({
              PlaylistId: SongPlaylistId,
              SongData: card,
            });
            totalDuration += card.duration;
            totalDurationFormatted = convertToHHMMSS(totalDuration);
            ArtistCard += `
            <div id="${card.id}" class="artistSongCard AlbumPlayCard">
                        <img src="${card.image[2].url}" alt="">
                    <p class="name">${card.name}</p>
                    <h5 class="album">${card.album.name}</h5>
                    </div>`;
          }
          document.querySelector(".ArtistSong-section").innerHTML = ArtistCard;
          console.log(totalDurationFormatted);
          document.querySelector(".TotalTimeOfDuration").innerHTML =
            "Total Play time: " + totalDurationFormatted;
          AlbumPlay2(data, SongPlaylistId, ClickedPlayListSong, dataPath);
        });
    });
  });
}
async function AlbumList() {
  let AlbumCards = document.querySelectorAll(".AlbumCard");

  AlbumCards.forEach((card) => {
    card.addEventListener("click", (event) => {
      const AlbumId = event.currentTarget.id;

      fetch(`https://saavn.dev/api/albums?id=${AlbumId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          hideAllSections();
          document.querySelector(".Artist-section").style.display = "block";
          let dataPath = data.data.songs;
          let ArtistImages = document.querySelectorAll(".ArtistImg");
          ArtistImages.forEach((img) => {
            img.src = data.data.image[2].url;
          });
          document.querySelector(".ArtistSectionName").innerHTML =
            data.data.name;
          ClickedPlayListSong.length = 0;
          let SongPlaylistId = AlbumId;
          let ArtistCard = ``;
          for (card of data.data.songs) {
            playlistArr.push({ PlaylistId: SongPlaylistId, SongData: card });
            ClickedPlayListSong.push({
              PlaylistId: SongPlaylistId,
              SongData: card,
            });
            totalDuration += card.duration;
            totalDurationFormatted = convertToHHMMSS(totalDuration);
            ArtistCard += `
            <div id="${card.id}" class="artistSongCard AlbumPlayCard">
                        <img src="${card.image[2].url}" alt="">
                    <p class="name">${card.name}</p>
                    <h5 class="album">${card.album.name}</h5>
                    </div>`;
          }
          document.querySelector(".ArtistSong-section").innerHTML = ArtistCard;
          document.querySelector(".TotalTimeOfDuration").innerHTML =
            "Total Play time: " + totalDurationFormatted;
          AlbumPlay2(data, SongPlaylistId, ClickedPlayListSong, dataPath);
        });
    });
  });
}

async function AlbumPlay2(data, SongPlaylistId, ClickedPlayListSong, dataPath) {
  let SongCards = document.querySelectorAll(".AlbumPlayCard");

  SongCards.forEach((card) => {
    card.addEventListener("click", (event) => {
      const SongId = event.currentTarget.id;
      console.log("SongId is " + SongId);
      console.log(ClickedPlayListSong);
      const SongDatas = ClickedPlayListSong.filter(
        (obj) => obj.SongData.id === SongId
      );
      console.log("Filtered SongData:", SongDatas);
      console.log(SongPlaylistId);
      console.log(SongDatas);
      console.log(ClickedPlayListSong);
      let PlaylistId = SongPlaylistId;
      const SongPlaylistDataId = playlistArr.filter(
        (obj) => obj.PlaylistId === SongPlaylistId
      );
      console.log(SongPlaylistDataId);
      console.log("Song dta");
      let SongLink = SongDatas[0].SongData;
      console.log(SongLink);
      const url = SongLink.downloadUrl[4].url;
      let FindIn = ClickedPlayListSong.findIndex((obj) => obj.id == SongId);
      FindIn = FindIn + 1;
      console.log("SongCurrentIndex" + FindIn);
      SongCurrentIndex = FindIn;
      audioPlayer.src = url;
      console.log(ClickedPlayListSong);
      UpdateSongInfo(SongLink, PlaylistId, ClickedPlayListSong);
      queueSong(ClickedPlayListSong, SongId, PlaylistId);
    });
  });
}

async function queueSong(ClickedPlayListSong, SongId, PlaylistId) {
  console.log("it is the queue o");
  let queueArr = [];
  let PrevQue = [];
  SongPlaylistId = PlaylistId;
  console.log(ClickedPlayListSong);
  const SongPlaylistDataId = playlistArr.filter(
    (obj) => obj.PlaylistId === SongPlaylistId
  );
  let FindIn = ClickedPlayListSong.findIndex(
    (obj) => obj.SongData.id === SongId && obj.PlaylistId === PlaylistId
  );
  SongCurrentIndex = FindIn;
  console.log(FindIn);

  for (let i = FindIn; i < ClickedPlayListSong.length; i++) {
    queueArr.push(ClickedPlayListSong[i].SongData);
  }
  for (let i = FindIn; i >= 0; i--) {
    PrevQue.push(ClickedPlayListSong[i].SongData);
  }

  let QueueCard = "";
  for (let card of queueArr) {
    QueueCard += `<div id="${card.id}" class="SongQueueCard">
  <div  class="img-section">
      <img class="img" crossOrigin="anonymous"
          src="${card.image[2].url}">
  </div>
  <div class="song-detail">
      <h4>${card.name}</h4>
      <h5>${card.album.name}</h5>
  </div>
  </div>`;
  }
  document.querySelector(".SongQueue").innerHTML =
    `<h3 style="padding:10px 0;"> Related songs </h3>` + QueueCard;
  console.log(queueArr);
  console.log(PrevQue);
  let SongCards = document.querySelectorAll(".SongQueueCard");

  SongCards.forEach((card) => {
    card.addEventListener("click", (event) => {
      const SongId = event.currentTarget.id;
      console.log(SongId);
      const SongDt = ClickedPlayListSong.filter(
        (obj) => obj.SongData.id === SongId
      );
      console.log("Song dta");
      const SongLink = SongDt[0].SongData;
      console.log(SongLink);
      let FindIn1 = ClickedPlayListSong.findIndex(
        (obj) => obj.SongData.id === SongId && obj.PlaylistId === PlaylistId
      );
      SongCurrentIndex = FindIn1;
      const url = SongLink.downloadUrl[4].url;

      audioPlayer.src = url;
      UpdateSongInfo(SongLink, PlaylistId, ClickedPlayListSong);
    });
  });
}
