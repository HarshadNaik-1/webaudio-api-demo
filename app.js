//creates a base audio context
const audioContext = new AudioContext();

//get the audio elements source
const audioElement = document.querySelector("audio");

//pass it to audio context for more functionality from web audio api
const track = audioContext.createMediaElementSource(audioElement);

//select play btn
const playButton = document.querySelector("button");

//change volume/modify
const gainNode = audioContext.createGain(); //can use (new GainNode())

//updating gain value
const volumeControl = document.querySelector("#volume");

//stereo sound
const pannerOptions = { pan: 0 };
const panner = new StereoPannerNode(audioContext, pannerOptions);

//panner controller
const pannerControl = document.querySelector("#panner");

//Event listners

playButton.addEventListener(
  "click",
  function () {
    //check if context is in suspended state (autoplay policy)
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }
    //play or pause track depending on state
    if (this.dataset.playing === "false") {
      audioElement.play();
      this.dataset.playing = "true";
      //console.log("play");
    } else if (this.dataset.playing === "true") {
      audioElement.pause();
      this.dataset.playing = "false";
      //console.log("pause");
    }
  },
  false
);

audioElement.addEventListener(
  "ended",
  () => {
    playButton.dataset.playing = "false";
    //console.log("it has finished");
  },
  false
); //checks if track ended

volumeControl.addEventListener(
  "input",
  function () {
    gainNode.gain.value = this.value;
  },
  false
); //modify sound

pannerControl.addEventListener(
  "input",
  function () {
    panner.pan.value = this.value;
  },
  false
);

//updates to the audio graph/track to connect input
track.connect(audioContext.destination);
track.connect(gainNode).connect(audioContext.destination);
track.connect(gainNode).connect(panner).connect(audioContext.destination);
