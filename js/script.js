const wrapper = document.querySelector(".wrapper");
const musicImg = wrapper.querySelector(".img-area img");
const musicName = wrapper.querySelector(".song-details .name");
const musicArtist = wrapper.querySelector(".song-details .artist");
const mainAudio = wrapper.querySelector("#main-audio");
const playPauseBtn = wrapper.querySelector(".play-pause");
const prevBtn = wrapper.querySelector("#prev");
const nextBtn = wrapper.querySelector("#next");
const progressArea = wrapper.querySelector(".progress-area");
const progressBar = wrapper.querySelector(".progress-bar");
const musicList = wrapper.querySelector(".music-list");
const showMoreBtn = wrapper.querySelector("#more-music");
const hideMusicBtn = wrapper.querySelector("#close");

showMoreBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");
});

// let musicIndex = 0;
let musicIndex = Math.floor(Math.random() * allMusic.length);

window.addEventListener("load", () => {
    loadMusic(musicIndex);
    playingNow();
})

// load music function
function loadMusic(indexNum) {
    musicName.innerText = allMusic[indexNum].name;
    musicArtist.innerText = allMusic[indexNum].artist;
    musicImg.src = `images/${allMusic[indexNum].img}.jpg`;
    mainAudio.src = `songs/${allMusic[indexNum].src}.mp3`;


    let audioDuration = mainAudio.duration;
    // console.log(audioDuration);
}

// play music function
function playMusic() {
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
    playingNow();
}

// pause music function
function pauseMusic() {
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}

// next music function
function nextMusic() {
    musicIndex++;
    musicIndex = (musicIndex >= allMusic.length) ? 0 : musicIndex;
    loadMusic(musicIndex);
    playMusic();
}

// prev music function
function prevMusic() {
    musicIndex--;
    musicIndex = (musicIndex < 0) ? (allMusic.length - 1) : musicIndex;
    loadMusic(musicIndex);
    playMusic();
}

// play or pause music event
playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = wrapper.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
})

nextBtn.addEventListener("click", () => {
    nextMusic();
})

prevBtn.addEventListener("click", () => {
    prevMusic();
})

mainAudio.addEventListener("timeupdate", (e) => {
    const currTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    mainAudio.addEventListener("loadeddata", () => {
        let musicDuration = wrapper.querySelector(".duration");


        // update song total duration
        let audioDuration = mainAudio.duration;
        // console.log(audioDuration);
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10)
            totalSec = `0${totalSec}`;
        musicDuration.innerText = `${totalMin}:${totalSec}`;


    });

    let musicCurrTime = wrapper.querySelector(".current");
    // update playing song current time
    let currMin = Math.floor(currTime / 60);
    let currSec = Math.floor(currTime % 60);
    if (currSec < 10)
        currSec = `0${currSec}`;
    musicCurrTime.innerText = `${currMin}:${currSec}`;

    // updating playing song current time according to progress
    progressArea.addEventListener("click", (e) => {
        // console.log("clicked");
        let progressWidth = progressArea.clientWidth;
        let clickedoffSetX = e.offsetX;
        let songDuration = mainAudio.duration;

        mainAudio.currentTime = (clickedoffSetX / progressWidth) * songDuration;
        // playMusic();
    })
})

const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
    let getText = repeatBtn.innerText;
    switch (getText) {
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song Looped");
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playback shuffle");
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist Looped");
            break;
    }
})

mainAudio.addEventListener("ended", () => {
    let getText = repeatBtn.innerText;
    switch (getText) {
        case "repeat":
            nextMusic();
            break;
        case "repeat_one":
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle":
            let randomIndex = Math.floor(Math.random() * allMusic.length);
            while (musicIndex == randomIndex) {
                randomIndex = Math.floor(Math.random() * allMusic.length);
            };
            loadMusic(randomIndex);
            playMusic();
            break;

    }
})

const ulTag = wrapper.querySelector("ul");

for (let i = 0; i < allMusic.length; i++) {
    let liTag = `
        <li li-index=${i}>
            <div class="row">
                <span>${allMusic[i].name}</span>
                <p>${allMusic[i].artist}</p>
            </div>
            <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
            <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
        </li>
    `;

    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", () => {
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10)
            totalSec = `0${totalSec}`;
        liAudioDuration.innerText = `${totalMin}:${totalSec}`;
        liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });

}

// play partivular song on click
const allLiTags = ulTag.querySelectorAll("li");
console.log(allLiTags);

function playingNow() {
    for (let j = 0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector(".audio-duration");
        if (allLiTags[j].classList.contains("playing")) {
            allLiTags[j].classList.remove("playing");
            let tDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = tDuration;
        }

        if (allLiTags[j].getAttribute("li-index") == musicIndex) {
            allLiTags[j].classList.add("playing");
            audioTag.innerText = "Playing";
        }
        allLiTags[j].setAttribute("onclick", "clicked(this)");
    }
}


function clicked(element) {
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}