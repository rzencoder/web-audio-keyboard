
document.addEventListener("DOMContentLoaded", function(){

  //Frequencies list from http://www.phy.mtu.edu
  const frequencies = [
    ["rest", 0],
    ["b3", 233.08],
    ["c4", 261.63],
    ["db4", 277.18],
    ["d4", 293.66],
    ["eb4", 311.13],
    ["e4", 329.63],
    ["f4", 349.23],
    ["gb4", 369.99],
    ["g4", 392.00],
    ["ab4", 415.30],
    ["a4", 440.00],
    ["bb4", 466.16],
    ["b4", 493.88],
    ["c5", 523.25],
    ["db5", 554.37],
    ["d5", 587.33],
    ["eb5", 622.25],
    ["e5", 659.25],
    ["f5", 698.46],
    ["gb5", 739.99],
    ["g5", 783.99],
    ["ab5", 830.61],
    ["a5", 880.00],
    ["bb5", 932.33],
    ["b5", 987.77],
    ["c6", 1046.50],
    ["d6", 1174.66],
    ["e6", 1318.51]
  ];

  const demoButtons = Array.from(document.querySelectorAll('.demo-button'));
  const tempoInput = document.querySelector('.tempo');
  const volumeInput = document.querySelector('.volume');
  const blackKey = Array.from(document.querySelectorAll('.black'));
  const whiteKey = Array.from(document.querySelectorAll('.white'));
  const help = document.querySelector('.help');
  const key = Array.from(document.querySelectorAll('.key'));
  let volume = 0.5;
  //Lower value = faster speed
  let tempo = 5;

  //Create new audio context when note played
  function playNote(note, length) {
    const AudioContext = window.AudioContext || window.webkitAudioContext,
    ctx = new AudioContext(),
    oscillator = ctx.createOscillator(),
    gainNode = ctx.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.value = note;
    gainNode.gain.value = volume;
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.start(0);
    //Trying to prevent popping sound on note end. Probably can be improved
    gainNode.gain.setTargetAtTime(0, length/1000-0.05, 0.08);
    oscillator.stop(ctx.currentTime + (length/1000+0.2));
    oscillator.onended = () => ctx.close();
  }

  //Finds clicked element returns data-note value and runs playKey function
  function onClickPlay(e) {
    let key = 0;
    let length = 300;
    let noteClass = e.target.dataset.note;
    for (let i = 0; i < frequencies.length; i++) {
      if (frequencies[i][0] === noteClass) {
        key = frequencies[i][1];
      }
    }
    addVisual(e.target);
    playNote(key, length);
  }

  //Finds pressed key and returns data-note value
  function keyDownSearch(event) {
    let key = 0;
    let length = 300;
    let keyPressed = document.querySelector(`div[data-key="${event.keyCode}"]`);
    if (keyPressed === null) {
      return;
    }
    let note = keyPressed.dataset.note;
    for (let i = 0; i < frequencies.length; i++) {
      if (frequencies[i][0] === note) {
        key = frequencies[i][1];
      }
    }
    addVisual(keyPressed);
    playNote(key, length);
  }

  //add each note to setinterval and playNote
  function demo(arr, e){
    let noteLength = 0;
    e.target.classList.add('on');
    tempoInput.disabled = true;
    demoButtons.forEach((btn)=>{
      btn.disabled = true;
    });
    for(let i = 1; i < arr.length; i++){
      noteLength += arr[i-1][2]*tempo;
      setTimeout(() => {
        playNote(arr[i][1], arr[i][2]*tempo);
        if(arr[i][1] !== 0){
          document.querySelector(`[data-note=${arr[i][0]}]`).classList.add('played');
        }
        setTimeout(() => {
          if(arr[i][1] !== 0){
            document.querySelector(`[data-note=${arr[i][0]}]`).classList.remove('played');
          }
          if(arr.length-2 < i){
            e.target.classList.remove('on');
            tempoInput.disabled = false;
            demoButtons.forEach((btn)=>{
              btn.disabled = false;
            });
          }
        }, arr[i][2]*tempo-0.05);
      }, noteLength)
    }
  }

  //map notes in song to frequencies
  function findFrequencies(song, e){
    let arr = [];
    song.forEach((note)=>{
      frequencies.forEach((frequency)=>{
        if(note[0] === frequency[0]){
          arr.push([note[0], frequency[1], note[1]])
        }
      })
    })
    demo(arr, e);
  }

  //play demo according to which one selected
  function demoHandler(e){
    if(e.target.classList.contains('demo1')){
      findFrequencies(noSuprises, e);
    }
    if(e.target.classList.contains('demo2')){
      findFrequencies(lifeOnMars, e);
    }
    if(e.target.classList.contains('demo3')){
      findFrequencies(furElise, e);
    }
    if(e.target.classList.contains('demo4')){
      findFrequencies(theEntertainer, e);
    }
  }

  //input handlers
  function updateTempo(e){
    tempo = e.target.value;
  }
  function updateVolume(e){
    volume = e.target.value;
  }

  //adds css class when note played
  function addVisual(key, length) {
      key.classList.add('played');
      setTimeout(() => {
        key.classList.remove('played');
      }, length || 300);
  }

  //keyboard information toggle
  let helpOn = true;
  function helpToggle() {
    if (helpOn) {
      blackKey.forEach((key)=>{
        key.style.color = 'rgba(0,0,0,0)';
      });
      whiteKey.forEach((key)=>{
        key.style.color = 'rgba(255,255,255,0)';
      });
      help.classList.remove('on');
      helpOn = !helpOn;
    } else {
      blackKey.forEach((key)=>{
        key.style.color = 'rgba(255,255,255,1)';
      })
      whiteKey.forEach((key)=>{
        key.style.color = 'rgba(0,0,0,1)';
      })
      help.classList.add('on');
      helpOn = !helpOn;
    }
  }

  //event listeners
  help.addEventListener('click', helpToggle);
  demoButtons.forEach((key)=>{
    key.addEventListener('click', demoHandler);
  })
  key.forEach((key)=>{
    key.addEventListener('click', onClickPlay);
  })
  window.addEventListener('keydown', keyDownSearch);
  tempoInput.addEventListener('change', updateTempo);
  volumeInput.addEventListener('change', updateVolume);

  //Hide keyboard help letters on load
  helpToggle();
});
