import Template from "../components/Template";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {guitar, piano, french_horn, drums, instrumentPitches, instrumentObjects } from "../data/instruments.js";
import { pitchFromBar} from "../components/Preview";

//----> Comments which state that "Takes inspiration from the week 8 contact" will use the reference below <-----
//Luscombe, M (2022). Week 8 contact. COMP2140 notion page. https://mattluscombe.notion.site/Week-8-Contact-d2f5e272d7684d16b81996a20ac87027



/**
   * A page which provides a section to name a sample, as well as save and preview it. The main body allows for the the adjustment of multiple sequences of bars
   * which can have bars filled depending on if a sample is being created or editied.
   * @param {Array} samples The api samples, array of objects
   * @param {toneObject} toneObject The passed tone Object
   * @param {toneTransport} toneTransport The passed tone Part
   * @param {tonePart} tonePart The passed tone part
   * @param {function} getSamples The function which updates the samples useState in the parent layer
   * @returns {} The elements comprising the sample edit/create page
   */
export default function SampleEdit({samples, toneObject, toneTransport, tonePart, getSamples}) {


    let {id} = useParams();

    let apiKey = "CnGp1NRD"

    //Filters the passed list of samples down to the sample with the ID matching the page. Initialises page's current sample, the recording data and the object name of the instrument.
    const filteredSamples = samples.filter((sample) => (sample.id == id));
    let currentSample = [];
    let sampleRecordingData = [];
    let currentInstrumentObjectName = "piano";

    //Sets the correct sample to a variable, sets the object name of the instrument to a variable and sets the recording data from that sample. 
    //These are global variables to be used throughout the components
    if (filteredSamples.length != 0) {
        currentSample = filteredSamples[0];
        currentInstrumentObjectName = currentSample.type;
        sampleRecordingData = JSON.parse(currentSample.recording_data);
    } 

    //Variables for the displayed title in the form and whether or the user is creating or editing a sample.
    let title;
    let createState;

    //Sets the title of the page depending on if you are editing a sample or not.
    if (typeof id == "undefined") {
        title = "Create A Sample:"
        createState = true;
    } else {
        title = "Editing This Sample:"
        createState = false;
    }

    
    //Takes current sample - the data of the current sample in JSON form.
    //InstrumentName, the instrument object name as a string
    //updated data a function 
    //previewing a boolean
    //set Previewing a function to set the previewing state
    //tonePart a tone part object
    //seuence, an array of bar objects
    
    /**
     * A sample form section which allows for the adjusting of the sample's name, as well as the buttons to preview the current sequencer infomation 
     * and a button to save the sample to the api
     * @param {Object} currentSample The sample currently looked at in this page
     * @param {string} instrumentName The instrument object name as a string
     * @param {function} getUpdatedData A function to get the data in the current sequencers
     * @param {toneObject} instrument The tone object sampler, either guitar, piano, french_horn or drums
     * @param {boolean} previewing A state depicting if a preview is in progress
     * @param {function} setPreviewing The function to set the previewing state
     * @param {tonePart} tonePart The passed Tone Part
     * @param {Array} sequence The object containing all the information for the different bar ids
     * @returns {} A section element with multiple elements within to depict the section which allows for naming, previewing and saving a sample.
     */
    function SampleForm({currentSample, instrumentName, getUpdatedData, instrument, previewing, setPreviewing, tonePart, sequence}) {

        //Use states for the sample and name of the sample.
        const [sample, setCurrentSample] = useState(currentSample);
        const [sampleName, setName] = useState(sample.name);

        useEffect(() => {

            tonePart(instrument).clear();
            toneTransport.cancel();
    
            sequence.filter(bar => bar.barEnabled).forEach(bar => {
                if (bar.barID % 16 != 0) {
                    tonePart(instrument).add(((bar.barID % 16) - 1) / 2, bar.barPitch); 
                } else {
                    tonePart(instrument).add((15) / 2, bar.barPitch);
                }
            });
    
            toneTransport.schedule(time => {
                setPreviewing(false);
                console.log("Preview stopped automatically.");
            }, 16/2);
        });

        /**
         * Handles editing the input for the sample's title value, sets the current state used to display what is in the input to continuously update to the result of what is appended
         * or deleted to the current input's title value.
         * @param {} event the event for the button click
         */
        const handleChangeTitle = (event) => {
            setCurrentSample({...sample, name: event.target.value});
            setName(event.target.value);
        }

        /**
         * Handles submitting from the form, will send the current sample's data to the database.
         * @param {} event the event for the button click
         */
        const handleSubmit = async (event) => {

            event.preventDefault();

            //Sets the current data of the sequencers to a value
            let updatedNoteData = getUpdatedData();

            //Initialize an array of objects correlating to the sequencers data for sending to the database
            let postBody = [
                {"B": []},
                {"A": []},
                {"G": []},
                {"F": []},
                {"E": []},
                {"D": []},
                {"C": []}
            ];

            //Use effect handles playing the insruments from the bars in the preview

            //Goes through each boolean value and assigns them to the relevant pitch in the postBody. 
            //There are 112 boolean values, every 16 values denotes a different pitch, so it assigns them accordingly. E.G. (the value at updatedNoteData[0] is of pitch B
            //whereas the value at updatedNoteData[111] is of pitch C)
            let counter = 0;
            let postBodyIndex = 0;
            for(let i = 0 ; i < 112 ; i++) {
                if (counter == 16) {
                    postBodyIndex++;
                    counter = 0;
                }
                Object.values(postBody[postBodyIndex])[0].push(updatedNoteData[i])
                counter++;
            }

            let url;
            //Depending on if you are creating or editing a sample, will adjust the url used.
            if (createState) {
                url = `http://wmp.interaction.courses/api/v1/?apiKey=${apiKey}&mode=create&endpoint=samples&sampleType=${instrumentName}&sampleName=${sampleName}`;

            } else {
                url = `http://wmp.interaction.courses/api/v1/?apiKey=${apiKey}&mode=update&endpoint=samples&sampleType=${instrumentName}&sampleName=${sampleName}&id=${id}`;
            }
            await fetch(url, {
                method: "POST",
                body: JSON.stringify(postBody)
            });

            //Updates the samples that are displayed in the sample list.
            getSamples();
            return false;
        }
        
        return (
            <section className = "formSection">
                <form onSubmit={handleSubmit}>
                    <div className = "leftColumn">
                        <input name = "sampleTitle" type="text" value = {sample.name} onChange = {handleChangeTitle} onSubmit = {handleSubmit}/>
                    </div>
                    <div className = "rightColumn">
                        <CustomPreview previewing={previewing} setPreviewing={setPreviewing} toneObject={toneObject} toneTransport={toneTransport} />
                        <button type = "button" className = "saveButton" onClick={handleSubmit}>Save</button>
                    </div>
                </form>
            </section>
        )
    }

    /**
         * The bar component
         * @param {int} barID the id of the bar associated with the component
         * @param {boolean} barEnabled Whether or not the bar has been enabled or not
         * @param {function} handleBarClick The function to handle whne the bar is clied
         * @returns {div} A div depicting the bar
     */
    //Inspiration has been taken from the week 8 contact
    function Bar({ barID, barEnabled, handleBarClick}) {

        //This is a bar, when it is selected, it will append selected on to the classname along with its' id
        function barSelected() {
            if (barEnabled) {
                return "selected";
            }
            return "";
        }
    
        return (
            <div className={`bar bar-${barID} ${barSelected()}`} onClick={handleBarClick}>
            </div>
        );
    }

    /**
         * Multiple individual bar components which make up this "Bars" component.
         * @param {Array} sequence The object containing all the information for the different bar ids
         * @param {Object} currentSequence The current sequence passed into the comonent for the array of sequences
         * @param {function} setSequence The function to set the state which depicts all information for the different bar ids 
         * @param {toneObject} toneObject The passed Tone Object 
         * @param {toneObject} instrument The tone object sampler, either piano, french_horn, guitar or drums.  
         * @returns {} Mutliple "Bar" components
     */
    //Inspiration has been taken from the week 8 contact
    function Bars({ sequence, currentSequence, setSequence, toneObject, instrument}) {
        
        /**
             * Compares a bar to another bar to determine their ordering
             * @param {Object} bar The first bar object for comparison
             * @param {Object} otherBar The second bar object for comparison
             * @returns {int} integer representing comparison result
         */
        //inspiration taken from the week 8 contact
        function sortSequence(bar, otherBar) {
            if (bar.barID < otherBar.barID) {
                return -1;
            }
            if (bar.barID > otherBar.barID) {
                return 1;
            }
            return 0;
        }

         /**
             * A function to get the pitch from a passed sequence ID (correlating to the bar)
             * @param {int} sequenceID The Id of a particlar sequence (of which there are 7 for the different pitches)
             * @returns {string} The specific pitch corresponding to that sequence Id
         */
        function pitchFromSequenceID(sequenceID) {
            //Corrects the sequence ID to correlate to the relevant pitch in instrumentPitches
            let index = sequenceID - 1;
            return instrumentPitches[index];
        }
        
        /**
             * Handles bar clicking to play the pitch associated with that bar and sets the state of the bar to be enabled.
             * @param {Object} bar The bar object in question
             * @param {toneObject} instrument The tone object sampler, either guitar, piano, french_horn or drums
         */
        //Takes inspiration for the week 8 contact
        function handleBarClick(bar, instrument) {

            let pitch = pitchFromSequenceID(currentSequence.sequenceID);

            const now = toneObject.now();
            instrument.triggerAttackRelease(pitch, "0.5", now);
            let filteredSequence = sequence.filter((_bar) => _bar.barID !== bar.barID);
            setSequence([ ...filteredSequence, { ...bar, barEnabled: !bar.barEnabled } ]);
        }

        //Creates a sequence of bars and assigns the corresponding bars (according to their ids) to that sequence according to the sequence ID.
        if (currentSequence.sequenceID == 1) {
            return sequence.sort(sortSequence).map(bar => {
                if (bar.barID <= 16) {
                    return <Bar key={bar.barID} {...bar} handleBarClick={() => handleBarClick(bar, instrument)}/>
                }
            });
        } else {
            return sequence.sort(sortSequence).map(bar => {   
                if (bar.barID <= currentSequence.sequenceID * 16 && bar.barID > (currentSequence.sequenceID-1) * 16) {
                    return <Bar key={bar.barID} {...bar} handleBarClick={() => handleBarClick(bar, instrument)} />
                }
            });
        }
    } 

    /**
     * A preview button to playback the data from the sequencers. (This is made in here and doesn't use the component because of rendering before useState intialization problems
     * I think there is a fix that I have using in ShareSample.js however regarding conditional rendering, but I haven't done it in here).
     * @param {boolean} previewing A state depicting if a preview is in progress
     * @param {function} setPreviewing The function to set the previewing state
     * @param {toneObject} toneObject The passed tone Object
     * @param {toneTransport} toneTransport The passed tone Part
     * @returns {button} A button element
     */
    //Takes inspiration for the week 8 contact.
    function CustomPreview({ previewing, setPreviewing, toneObject, toneTransport }) {

        /**
         * Handles clicking the preview button, plays the tone object.
         * @param {} event the event for the button click
         */
        function handleButtonClick(event) {
            event.preventDefault();
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
        
        return <button type="button" className = "previewButton" onClick={handleButtonClick}>{previewing ? "Stop Previewing" : "Preview"}</button>;
    }
    
    /**
     * The component depicting the section that allows for the changing of all the sequencers used instrument.
     * @param {function} setInstrument The function to set the instrument state in the instrument useState
     * @returns {} A section containing the button elements for chaning between instruments.
     */
    function InstrumentSelection({setInstrument}) {


        /**
         * Gets whether or not a particular instrument object name is the current one used by the sample.
         * @param {string} instrumentObjectName A passed instrument object name, either piano, french_horn, guitar or drums
         * @returns {string} The string, either "" or selected for appending onto a className 
         */
        const getInstrumentState = (instrumentObjectName) => {return currentInstrumentObjectName != instrumentObjectName ? "" : "selected"}
            

        //Depending on the clicked instrument, will setInstrument differently
        let instrumentNames = ["Piano", "French Horn", "Guitar", "Drums"];
        let instrumentObjectNames = ["piano", "french_horn", "guitar", "drums"];

        /**
         * When one of the buttons is clicked, will set the state of the currently used instrument to whatever instrument is clicked
         * Will also set the currentInstrumentObjectName variable to the corresponding name in instrumentObjectNames
         * @param {} event the event for the button click
         */
        function handleClick(event) {
            //Instrument objects is an array imported from instruments
            setInstrument(instrumentObjects[event.target.id]);
            currentInstrumentObjectName = instrumentObjectNames[event.target.id];
        }
        
        return (
            <section className = "instrumentSelectSection">
                <ul>
                    {instrumentNames.map((instrument,index) => {  
                    return <button  type ="button" onClick={handleClick} key ={index} id={index} 
                    className = {`instrument ${getInstrumentState(instrumentObjectNames[index])}`}>{instrument}</button>;
                    } )}
                </ul>
            </section>
        );

    }

    /**
     * 
     * @param {toneObject} toneObject The passed tone Object
     * @param {toneTransport} toneTransport The passed tone Part
     * @param {tonePart} tonePart The passed tone part
     * @param {sampleRecordingData} toneTransport The passed tone Part
     * @returns {button}
    */
    function Sequencer({ toneObject, toneTransport, tonePart, sampleRecordingData }) {

        /**
             * Compares a sequence to another bar to determine their ordering
             * @param {Object} sequence The first sequence object for comparison
             * @param {Object} otherSequence The second sequence object for comparison
             * @returns {int} integer representing comparison result
         */
        function sortSequences(sequence, otherSequence) {
            if (sequence.sequenceID < otherSequence.sequenceID) {
                return -1;
            }
            if (sequence.sequenceID > otherSequence.sequenceID) {
                return 1;
            }
            return 0;
        }

        //State for the recording data (the bars and their states, etc)
        const [recordingData] = useState(sampleRecordingData);
        let combinedRetrievedData = [];

        //Merges all the values in the api's retrieved recording data into one big array.
        if (recordingData != []) {
            recordingData.forEach(entry => {
            combinedRetrievedData = combinedRetrievedData.concat(Object.values(entry)[0])});
        }

        /**
             * Gets a bar ID and then returns the corresponding index in the combined data of the api call's pitches 
             * @param {int} barID The first sequence object for comparison
             * @returns {boolean} A boolean depending on if the bar for the barID is activated or not.
         */
        const getEnabledStatus = (barID) => {let index = barID -1; 
            //If the element of the index is null return false, and if false return false, else true
            if (combinedRetrievedData[index] == null || combinedRetrievedData[index] == false) {
                return false;
            } else {
                return true;
            }};
        
        //Sets up an initial array of objects for all the potential bar ids
        const initialSequence = [];
        for(let bar = 1; bar <= 112; bar++) {
            let pitch = pitchFromBar(bar);
            initialSequence.push({
                barID: bar,
                barPitch: pitch,
                barEnabled: recordingData != [] ? getEnabledStatus(bar) : false
            });
        }

        //Sets up an initial array of objects for all the potential lines of bars/sequencers (of which there are 7 for the 7 pitches )
        //Tajkes some inspiration from the week 8 contact
        const initialBars = [];
        for (let sequence = 1; sequence <= 7; sequence++) {
            initialBars.push({
                sequenceID : sequence,
            });
        }

        /**
             * Function to get the new updated note data from the bars in the sequence
             * @returns {Array} An array containing the active states (booleans) of all the bars in the current sequence state, there are insterted in order, so that the index
             * of the boolean corresponds to the original index of the bar ID it was inserted from.
         */
        function getUpdatedData() {
            let updatedData = [];
            sequence.forEach(entry => {updatedData.push(entry.barEnabled)})
            return updatedData;
        }

        //Use states for all the bars in the sequencers, the preview state and the current instrument used.
        const [sequence, setSequence] = useState(initialSequence);
    
        const initialPreviewing = false;

        const [previewing, setPreviewing] = useState(initialPreviewing);

        const [instrument, setInstrument] = useState(piano);

        useEffect(() => {
                //Based on the instrument name, will set the used instrument in the samplers and the instrument name usestate accordingly
            if (currentInstrumentObjectName == "piano") {
                setInstrument(piano);
            } else if (currentInstrumentObjectName == "french_horn") {
                setInstrument(french_horn);
            } else if (currentInstrumentObjectName == "guitar") {
                setInstrument(guitar);    
            } else if (currentInstrumentObjectName == "drums") {
                setInstrument(drums);
            }
        },[]);
    
        return (
            <>
                <SampleForm currentSample ={currentSample} instrumentName = {currentInstrumentObjectName} getUpdatedData = {getUpdatedData} previewing={previewing}
                setPreviewing={setPreviewing} tonePart={tonePart} toneObject={toneObject} toneTransport={toneTransport} sequence={sequence} instrument = {instrument}/>
                <section className = "innerSequencerSection">
                    {/* Very messy way to get titles for the bar and instrument select sections (something that can be said for everything in this project), 
                    I'm tired though, sorry*/}
                    <div className = "sequencerTitles">
                        <p>Type</p>
                        <p>B</p>
                        <p>A</p>
                        <p>G</p>
                        <p>F</p>
                        <p>E</p>
                        <p>D</p>
                        <p>C</p>
                    </div>
                    <div className = "sequencerContent">
                        <InstrumentSelection setInstrument={setInstrument}/>
                        <ul className="sequencer">
                            {initialBars.sort(sortSequences).map((barSequence, index) => 
                            <li key = {barSequence.sequenceID}><Bars sequence={sequence} currentSequence = {barSequence} setSequence={setSequence} 
                            toneObject={toneObject} instrument={instrument} key = {barSequence.sequenceID} /></li>)}
                        </ul>
                    </div>
                </section>

            </>
        );
    }


    return (
        <Template title = {title} logoType={"notSamples"}>
            <section className = "sequencersSection">
                <Sequencer toneObject={toneObject} toneTransport={toneTransport} tonePart={tonePart} sampleRecordingData = {sampleRecordingData} />
            </section>
        </Template>
    );
    
}