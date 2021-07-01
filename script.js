const image = document.querySelector('img');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const music = document.querySelector('audio');
const progressContainer = document.getElementById('progress-container');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const prevBtn = document.getElementById('prev');
const playBtn = document.getElementById('play');
const nextBtn = document.getElementById('next');

// Music files (array with a list of objects, namely the songs)
const songs = [
    {
        name: 'jacinto-1',
        displayName: 'Raggae Fusion',
        artist: 'Soundtrix', 
    },
    {
        name: 'jacinto-2',
        displayName: 'Seven Nation Army (Remix)',
        artist: 'Zabar', 
    },
    {
        name: 'jacinto-3',
        displayName: 'Good Night, Disco Queen',
        artist: 'Jacinto', 
    },
    {
        name: 'metric-1',
        displayName: 'Front Row',
        artist: 'Metric/Jacinto', 
    }
];

//  Check if playing
let isPlaying = false;

// Play
function playSong() {
    isPlaying = true;
    playBtn.classList.replace('fa-play', 'fa-pause');
    playBtn.setAttribute('title', 'Pause');
    music.play();
}

// Pause
function pauseSong() {
    isPlaying = false;
    playBtn.classList.replace('fa-pause', 'fa-play');
    playBtn.setAttribute('title', 'Play');
    music.pause();
}

// Play or Pause Event Listener
playBtn.addEventListener('click', () => (isPlaying ? pauseSong() : playSong()));

// Update DOM when songs are changed
function loadSong(song) {
    title.textContent = song.displayName;
    artist.textContent = song.artist;
    music.src = `music/${song.name}.mp3`;
    image.src = `img/${song.name}.jpg`;
}

// Current Song
let songIndex = 0;

// Previous Song
function prevSong() {
    songIndex--; // will decrease the index of the song by 1
    if (songIndex < 0) { // if prevBtn is pressed if the index is less than 1 (i.e. -1) then 
        songIndex = songs.length -1; // assign song index the length of the array songs - 1. I.E last object in the array. i.e. going from song 1 and pressing previous will take us to the last song in the list.
    }
    loadSong(songs[songIndex]);
    playSong();
}

// Next Song
function nextSong() {
    songIndex++; // will increase the index of the song by 1
    if (songIndex > songs.length -1) {  // if songIndex is greater than the length of the array for songs - then 1 
        songIndex = 0; // assign index to 0, so that the music starts from the beggning of the array songs
    }
    loadSong(songs[songIndex]);
    playSong();
    
}


// On load - Select First Song
loadSong(songs[songIndex]);  // will play the first song from the array songs

// Update Progress bar and time
function updateProgressBar(e) {
    if (isPlaying) {   // if audio is playing then:
        const { duration, currentTime } = e.srcElement; // 
     // console.log( duration, currentTime);  // brings the duration of the track and the current time
        // Update Progress bar Width
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
        // Calculate display for duration
        const durationMinutes = Math.floor(duration / 60); // Math.floor grabs the whole number. The divide by 60 is done so that the duration in seconds returns minutes. 
        let durationSeconds = Math.floor(duration % 60); // % remainder will return anything left over after dividing by 60 (ie. digits after the decimels). Duration of 2.06 will return 6 therefore:
        if (durationSeconds < 10) {
            durationSeconds = `0${durationSeconds}`; //so now it will ad a 0 to the digits if less than 10. otherwise 11seconds upwards are fine.
        }
    //  console.log(durationSeconds);
        // Delay switching duration Element to avoid the NAN appearing
        if (durationSeconds) { // because duration value is calculated after the durationMinutes the NAN appears, therefore: if we have a value for durationSeconds then:
            durationEl.textContent = `${durationMinutes}:${durationSeconds}`; // we will pass the duration minutes and duration seconds to the element durationEl, thus showing us the time.
        // Calculate display for Current Time
        const currentMinutes = Math.floor(currentTime / 60); // Math.floor grabs the whole number. The divide by 60 is done so that the current in seconds returns minutes. 
        let currentSeconds = Math.floor(currentTime % 60); // % remainder will return anything left over after dividing by 60 (ie. digits after the decimels). current of 2.06 will return 6 therefore:
        if (currentSeconds < 10) {
            currentSeconds = `0${currentSeconds}`; //so now it will ad a 0 to the digits if less than 10. otherwise 11seconds upwards are fine.
            currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
        } else {
            currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
        }
        }
    }
}

// Set progress bar - clicking the progress bar allowing to move to that time in the track
function setProgressBar(e) {
    console.log(e);
    const width = this.clientWidth; // using this code we can see the legth of the progress bars width
    console.log('width:', width);
    const clickX = e.offsetX; // offsetX is the horizontal location of where we clicked on the progress bar, found using console.log and going into srsElement
    console.log('clickX:', clickX);
    const { duration } = music;
    console.log(clickX / width);
    console.log('Percentage',(clickX / width) * duration);
    music.currentTime = (clickX / width) * duration;
}


// Event Listeners for the previous and next buttong
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

//Event listener for time update to progress bar
music.addEventListener('timeupdate', updateProgressBar);
progressContainer.addEventListener('click', setProgressBar);

// When the song has ended it should switch to the next song. The ended event listener simply runs nextSong function that we have already created
music.addEventListener('ended', nextSong);
