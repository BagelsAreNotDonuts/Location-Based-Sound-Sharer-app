import * as Tone from "tone";

//Exports of tone objects and transports for use in previewing
export const toneObject = Tone;

export const toneTransport = toneObject.Transport;

/**
    * Will create a tone part depending on the specified instrument object
    * @param {tonePart} instrument The tone object sampler, either piano, french_horn, guitar or drums
    * @returns A tone object corresponding to the passed instrument.
*/
export const tonePart = (instrument) => (new toneObject.Part((time, note) => {
    instrument.triggerAttackRelease(note, "0.5", time);
}, []).start(0));


//Exports of constants for names of the specific instrument pitches used, and the general instrument pitches.
export const instrumentPitches = ["B3","A3","G3","F3","E3","D3","C3"];

export const instrumentPitchTitles = ["B","A","G","F","E","D","C"];

//Exports for the four instrument samplers to be used throughout
export const guitar = new toneObject.Sampler({
    urls: {
        "F3": "F3.mp3",
        "G3": "G3.mp3",
        "A3": "A3.mp3",
        "B3": "B3.mp3",
        "C3": "C3.mp3",
        "D3": "D3.mp3",
        "E3": "E3.mp3",
    },
    release: 1,
    baseUrl: "/samples/guitar-acoustic/"
}).toDestination();

export const drums = new toneObject.Sampler({
    urls: {
       "B3":"drums1.mp3",
       "A3":"drums2.mp3",
       "G3":"drums3.mp3",
       "F3":"drums4.mp3",
       "E3":"drums5.mp3",
       "D3":"drums6.mp3",
       "C3":"drums7.mp3",
    },
    release: 1,
    baseUrl: "/samples/drum-samples/"
}).toDestination();

export const french_horn = new toneObject.Sampler({
    urls: {
       "B3":"C2.mp3",
       "A3":"A3.mp3",
       "G3":"G2.mp3",
       "F3":"F3.mp3",
       "E3":"Ds2.mp3",
       "D3":"D3.mp3",
       "C3":"C4.mp3",
    },
    release: 1,
    baseUrl: "/samples/french-horn/"
}).toDestination();

export const piano = new toneObject.Sampler({
    urls: {
       "B3":"B3.mp3",
       "A3":"A3.mp3",
       "G3":"G3.mp3",
       "F3":"F3.mp3",
       "E3":"E3.mp3",
       "D3":"D3.mp3",
       "C3":"C3.mp3",
    },
    release: 1,
    baseUrl: "/samples/piano/"
}).toDestination();

export const instrumentObjects = [piano, french_horn, guitar, drums];


