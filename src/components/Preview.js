import { instrumentPitches } from "../data/instruments";
import { useState } from "react";
import {guitar, piano, french_horn, drums } from "../data/instruments.js";

 /**
   * Assigns pitches to bars according to the range the id of a bar lies within.
   * @param {int} barID The bar id of a bar 
   * @returns {string} The specific pitch of the instrument associated with the bar ID
   */
export function pitchFromBar(barID) {
    if (barID <= 16) {
        return instrumentPitches[0];
    } else if (barID > 16 && barID <= 32) {
        return instrumentPitches[1];
    } else if (barID > 32 && barID <= 48) {
        return instrumentPitches[2];
    } else if (barID > 48 && barID <= 64) {
        return instrumentPitches[3];
    } else if (barID > 64 && barID <= 80) {
        return instrumentPitches[4];
    } else if (barID > 80 && barID <= 96) {
        return instrumentPitches[5];
    } else if (barID > 96 && barID <= 112) {
        return instrumentPitches[6];
    }
}

/**
   * Creates a preview button which when clicked plays back the sample based on the passed ID
   * @param {Object} samples The retrieved api data of samples
   * @param {int} sampleID The id of a sample
   * @param {toneObject} toneObject The passed tone object
   * @param {toneTransport} toneTransport The passed tone transport
   * @param {tonePart} tonePart The passed tone part
   * @returns {button} A preview button
   */
export default function Preview({ samples, sampleID, toneObject, toneTransport, tonePart }) {

    //Initializes previewing state
    let initialPreviewing = false;
    const [previewing, setPreviewing] = useState(initialPreviewing);

    //Initialize variable for the current sequence used, the sample looked at, the recording data for that sample and the instrument name.
    let currentSequence = [];
    const filteredSamples = samples.filter((sample) => (sample.id == sampleID));
    let currentSample = filteredSamples[0];
    let recordingData = JSON.parse(currentSample.recording_data);
    let currentInstrumentName = currentSample.type;


    let combinedRetrievedData = [];

    //Merges all the values in the api's retrieved recording data into one big array.
    if (recordingData != []) {
        recordingData.forEach(entry => {
        combinedRetrievedData = combinedRetrievedData.concat(Object.values(entry)[0])});
    }

    /**
     * Gets the enabled status of a bar
     * @param {int} barID The bar id of a bar 
     * @returns {string} The specific pitch of the instrument associated with the bar ID
    */
    const getEnabledStatus = (barID) => {let index = barID -1; return combinedRetrievedData[index]};

    //Pushes bar objects which contain each bar's information into the currentSequence array
    for(let bar = 1; bar <= 112; bar++) {
        let pitch = pitchFromBar(bar);
        currentSequence.push({
            barID: bar,
            barPitch: pitch,
            barEnabled: recordingData != [] ? getEnabledStatus(bar) : false
        });
    }
    
    /**
     * Returns the corret sampler object depending on the passed instrument object name.
     * @param {string} instrumentObjectName The passed string form of one of the 4 tone object sampler variable names
     * @returns {toneObject} The tone object sampler corresponding to the instrumentObjectName
    */
    const getInstrument = (instrumentObjectName) => {
        if (instrumentObjectName == "piano") {
            return piano;
        } else if (instrumentObjectName == "french_horn") {
            return french_horn
        } else if (instrumentObjectName == "guitar") {
            return guitar
        } else if (instrumentObjectName == "drums") {
            return drums
        }
    };

    /**
     * Resets and sets tone part and transport for use for the relevant sample, takes a sampler object.
     * @param {toneObject} instrument The tone sample object, can be either piano, french_horn, guitar or drums
     * @returns {toneObject} The tone object sampler corresponding to the instrumentObjectName
    */
    function initializeTones(instrument) {

        //First clears tone part, and then adds to the instrument tone part different tones at different times gained from the bar object of corresponding to a particular bar ID.
        tonePart(instrument).clear();
        toneTransport.cancel();
    
        currentSequence.filter(bar => bar.barEnabled).forEach(bar => {
            if (bar.barID % 16 != 0) {
                tonePart(instrument).add(((bar.barID % 16) - 1) / 2, bar.barPitch); 
            } else {
                tonePart(instrument).add((15) / 2, bar.barPitch);
            }
        });
    
        toneTransport.schedule(time => {
            setPreviewing(false);
        }, 16/2);
    }
    
    /**
     * On click will set everything involving playing tones up, and then will play the sample.
     * @param {toneObject} event The event of a button click
    */
    function handleButtonClick(event) {
        event.preventDefault();
        initializeTones(getInstrument(currentInstrumentName));
        toneObject.start();
        toneTransport.stop();

        if(previewing) {
            setPreviewing(false);
        }
        else {
            setPreviewing(true);
            toneTransport.start();
        }

    }
    

    return <button type = "button" className = "previewButton" onClick={handleButtonClick}>{previewing ? "Stop Previewing" : "Preview"}</button>;

}