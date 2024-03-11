

/* MIDI IO */

// Enable WebMidi API and handle any errors if it fails to enable.
// This is necessary to work with MIDI devices in the web browser.
await WebMidi.enable();



// Initialize variables to store the first MIDI input and output devices detected.
// These devices can be used to send or receive MIDI messages.
let myInput = WebMidi.inputs[0];
let myOutput = WebMidi.outputs[0];




// Get the dropdown elements from the HTML document by their IDs.
// These dropdowns will be used to display the MIDI input and output devices available.
let dropIns = document.getElementById("Dropdown Inputs");
let dropOuts = document.getElementById("Dropdown Outputs");





// For each MIDI input device detected, add an option to the input devices dropdown.
// This loop iterates over all detected input devices, adding them to the dropdown.
WebMidi.inputs.forEach(function (input, num) {
  dropIns.innerHTML += `<option value=${num}>${input.name}</option>`;
});




// Similarly, for each MIDI output device detected, add an option to the output devices dropdown.
// This loop iterates over all detected output devices, adding them to the dropdown.
WebMidi.outputs.forEach(function (output, num) {
  dropOuts.innerHTML += `<option value=${num}>${output.name}</option>`;
});




//let transposition = 0;   //PROBABLY USELESS

// Add an event listener for the 'change' event on the input devices dropdown.
// This allows the script to react when the user selects a different MIDI input device.
dropIns.addEventListener("change", function () {
  // Before changing the input device, remove any existing event listeners
  // to prevent them from being called after the device has been changed.
  if (myInput.hasListener("noteon")) {
    myInput.removeListener("noteon");
  }
  if (myInput.hasListener("noteoff")) {
    myInput.removeListener("noteoff");
  }

  // Change the input device based on the user's selection in the dropdown.
  myInput = WebMidi.inputs[dropIns.value];
  // myOutput = WebMidi.outputs[dropOuts.value];

  //define MIDI processing function
  const midiProcess = function (midiNoteInput) {
    let pitch = midiNoteInput.note.number + transposition;
    let velocity = midiNoteInput.note.rawAttack;

    let midiNoteOutput = new Note(pitch, { rawAttack: velocity });
    return midiNoteOutput;
  };

  // After changing the input device, add new listeners for 'noteon' and 'noteoff' events.
  // These listeners will handle MIDI note on (key press) and note off (key release) messages.
  myInput.addListener("noteon", function (someMIDI) {
    // When a note on event is received, send a note on message to the output device.
    // This can trigger a sound or action on the MIDI output device.
    myOutput.sendNoteOn(midiProcess(someMIDI));
  });

  myInput.addListener("noteoff", function (someMIDI) {
    // Similarly, when a note off event is received, send a note off message to the output device.
    // This signals the end of a note being played.

    myOutput.sendNoteOff(midiProcess(someMIDI));
  });
});





// Add an event listener for the 'change' event on the output devices dropdown.
// This allows the script to react when the user selects a different MIDI output device.
dropOuts.addEventListener("change", function () {
  // Change the output device based on the user's selection in the dropdown.
  // The '.channels[1]' specifies that the script should use the first channel of the selected output device.
  // MIDI channels are often used to separate messages for different instruments or sounds.
  myOutput = WebMidi.outputs[dropOuts.value].channels[1];
});









/*Chord Quality Dropdown Box*/

//creates variable for chord quality input box
let chordQuality = document.getElementById("chordQuality")

//creates an array of all chord quality options
let qualityOptions = ["Major", "Minor", "Diminished", "Augmented", "Major 7th", "Minor 7th", "Dominant 7th"]; 

//creates an option in the chordQuality box for each item of the array
qualityOptions.forEach(function (item){
    chordQuality.innerHTML += `<option>${item}</option>`;
  });


chordQuality.addEventListener("change", function (){
    console.log(`New chord quality, ${chordQuality.value}, selected!`);
    console.log(`The Quality Selection and Transposition are still acting independently of one another.`)
    //let qualityFunctionInput = qualityOptions[chordQuality.value];
  })

let chosenQuality = chordQuality.value      //this chosen chord quality will be an input parameter for makeChord











/*Transposition Slider*/

//creates a variable for the transSlider
let transSlider = document.getElementById("transSlider")

//trans slider change event
transSlider.addEventListener("change", function(){
    let transDisplay = document.getElementById("transDisplay"); //var for semitone display container
    transDisplay.innerText = transSlider.value //changes innertext of semitone display container to transSlider value
    // makeChord(60, "Major"); //placeholder chord
    // console.log(`This is a test where 60 is the MIDI Input and Major is the Quality. The makeChord funtion is called upon a change event of the Transposition Slider.`)
});

let transAmount = transSlider.value     //this chosen transposition amount will be an input parameter for makeChord






/* Chord Maker */

//take a midi pitch (root) and pushes midi pitches (notes of the determined chord) to an array
const makeChord = function(inputMidiRoot, quality){
    let chord = [];

    let newMidiRoot = parseInt(inputMidiRoot) + parseInt(transSlider.value);

    console.log(newMidiRoot); //test
    console.log(`This is a test to ensure that the original MIDI Root input is being transposed to the new MIDI Root that will be pushed to the "chord" array.`)
    chord.push(newMidiRoot);
    
    if (quality == 'Major'){
        chord.push(newMidiRoot + 4)
        chord.push(newMidiRoot + 7)
    } else if (quality == 'Minor') {
        chord.push(newMidiRoot + 3)
        chord.push(newMidiRoot + 7)
    } else if (quality == 'Diminished') {
        chord.push(newMidiRoot + 3)
        chord.push(newMidiRoot + 6)
    } else if (quality == 'Augmented') {
        chord.push(newMidiRoot + 4)
        chord.push(newMidiRoot + 8)
    } else if (quality == 'Major 7th') {
        chord.push(newMidiRoot + 4)
        chord.push(newMidiRoot + 7)
        chord.push(newMidiRoot + 11)
    } else if (quality == 'Minor 7th') {
        chord.push(newMidiRoot + 3)
        chord.push(newMidiRoot + 7)
        chord.push(newMidiRoot + 10)
    } else if (quality == 'Dominant 7th') {
        chord.push(newMidiRoot + 4)
        chord.push(newMidiRoot + 7)
        chord.push(newMidiRoot + 10)
    }

    console.log(chord);
    
    return chord //chord is the finished array of midi pitches
}