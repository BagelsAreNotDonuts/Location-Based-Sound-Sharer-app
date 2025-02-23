import React from "react";
import { Link } from "react-router-dom";
import Template from "../components/Template";
import { toneObject, toneTransport, tonePart } from "../data/instruments.js";
import SampleCard from "../components/SampleCard";


/**
   * Takes the sample's date and time string response and converts it to the format of "(12 hour time) day month year"
   * @param {string} sampleDateTime The timestamp for a particular sample's time of update  
   * @returns {string} The altered representation of the passed string timestamp 
   */
export function convertTimestamp(sampleDateTime) {

    //Splits the string into the date half and 24 hour half
    let splitDateAndTime = sampleDateTime.split(" ");
    
    //Assigns makes date object out of the first half and segments the second hald into [Hours, Minutes, Seconds].
    let date = new Date(splitDateAndTime[0]);
    let timeSegments = splitDateAndTime[1].split(":");

    //Gets month, year and day from first half
    let month = date.toLocaleString('default', { month: 'long' });
    let year = date.getFullYear();
    let day = date.getDate();

    //Takes hour segments and converts to 12 hour time
    //if hours is less than or equal to 12, then its' pm, otherwise am.
    let determineAmPm = timeSegments[0] >= 12 ? "pm" : "am";
    let hours = (timeSegments[0] % 12) || 12;
    let minutes = timeSegments[1];


    //merges all the info into one string
    let finalString = `${hours}:${minutes}${determineAmPm} ${day} ${month} ${year}`
    return finalString;
}

/**
   * A component which creates a list of sample cards, as well as a section containing a button to create a sample
   * @param {Object} samples The retrieved api call data for samples
   * @param {Object} samplesToLocations The retrieved api call data for samplesToLocations
   * @returns {} Multiple elements to depict a page which provides a list of samples and the options to edit them as well as create a new sample.
   */
function ListOfSamples({samples, samplesToLocations}) {

    return (
        <>
            <Template title ="Samples You've Created:" logoType={"samples"}>
        
    

            <section className = "samplesSection">
                <ul>
                    {samples.map((sample, index) => (
                        <SampleCard key = {index} sample = {sample} index = {index} samples = {samples} toneObject = {toneObject}
                        toneTransport = {toneTransport} tonePart = {tonePart} samplesToLocations = {samplesToLocations}/>
                    ))}
                </ul>
                </section>

                <section className = "createSampleSection">
                <div>
                    <Link to = {"/create-sample"}>
                        <button type = "button">Create Sample</button> 
                    </Link>
                </div>
            </section>
            </Template>
        </>
    );
}



export default ListOfSamples;