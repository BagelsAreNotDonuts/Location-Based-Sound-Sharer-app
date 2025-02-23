import React from "react";
import Template from "../components/Template";
import { toneObject, toneTransport, tonePart } from "../data/instruments.js";
import { useState} from "react";
import { useParams } from "react-router-dom";
import Preview from "../components/Preview";
import { convertTimestamp } from "./ListOfSamples";


// ----------> NOTE YOU CAN'T CLICK THE SHARE AND NOT SHARE BUTTONS BACK AND FORTH TOO FAST SINCE THE API REQUESTS(?) CAN'T KEEP UP, KEEP CLICKS TO EVERY ~4 seconds <----------

/**
   * The page which depicts the corresponding sample with a sample card that allows for previewing, as well as a list of locations below to depict whether or not it has been shared
   * at them (while also allowing for sharing/unsharing).
   * @param {Array} samples The retrieved samples from the api, array of objects
   * @param {Array} locations The retrieved locations from the api, array of objects
   * @param {Array} samplesToLocations The retrieved samplesToLocations from the api, array of objects
   * @param {function} getSamplesToLocations The function that sets the samplesToLocations state in the app
   * @returns {} The all elements comprising the share sample page.
*/
function ShareSample({samples, locations, samplesToLocations, getSamplesToLocations}) {

    //Gets the id from the url, the id will correspond to the sample card clicked on in the ListOfSamples page.
    let {id} = useParams();

    let apiKey = "CnGp1NRD"

    //Filters the passed list of samples down to the sample with the ID matching the page. Initialises page's current sample, the recording data and the object name of the instrument.
    const filteredSamples = samples.filter((sample) => (sample.id == id));
    let currentSample = filteredSamples[0];

    /**
     * Shares the sample to the specified location, sends a request to the database api
     * @param {string} locationID The location ID 
    */
    const createSampleAtLocation = async (locationID) => {
        //If the sample doesn't exist in the database, create it.
        if (!findSampleAtlocation(id, locationID)) {
            await fetch(`http://wmp.interaction.courses/api/v1/?apiKey=${apiKey}&mode=create&endpoint=samples_to_locations&sampleID=${id}&locationID=${locationID}`); 
        } else {
            console.log("Sample already in API");
        }
       
    };

    /**
     * Finds if the relevant sample is shared to the passed locationID
     * @param {string} sampleID The sample ID of the page
     * @param {string} locationID The location ID 
     * @returns {boolean} true or false, depending on if the sample is in the database
    */
    const findSampleAtlocation = (sampleID, locationID) => {
        if (samplesToLocations != undefined) {
            const filteredEntries = samplesToLocations.filter((entry) => (entry.locations_id == locationID && entry.samples_id == sampleID));
            return filteredEntries[0] != undefined ? true : false;
        } else {
            console.log("No samples in the API");
            return false;
        }};
    
    /**
     * Unassociates a sample from the specified location. Deletes the entry from the database.
     * @param {string} sampleID The sample ID of the page
     * @param {string} locationID The location ID 
    */
    const deleteSampleFromLocations = async (sampleID, locationID) => {
        if (samplesToLocations != undefined) {
            const filteredEntries = samplesToLocations.filter((entry) => (entry.locations_id == locationID && entry.samples_id == sampleID));
            const entryID = filteredEntries[0] != undefined ? filteredEntries[0].id : null;
            if (entryID != null) {
                await fetch(`http://wmp.interaction.courses/api/v1/?apiKey=${apiKey}&mode=delete&endpoint=samples_to_locations&id=${entryID}`);
                console.log("Delete success");
            } else {
                console.log("Sample not found at location");
            }
        } else {
            console.log("No samples in the API");
        }
    }

    /**
     * The component depicting a location "card", essentially the name of a location with two buttons that show if its' shared or not, to where the buttons can be 
     * clicked to share/unshare
     * @param {string} locationID The sample ID of the page
     * @param {string} locationName The location ID 
     * @returns {} The elements comprising the location card
    */
    function LocationCard({locationID, locationName}) {

        //The state for the button that tells whether it has been shared or not.
        const [sharedState, setSharedState] = useState(findSampleAtlocation(id,locationID));

        /**
         * Handles clicking one of the two buttons (not shared/shared), if it is not shared, will show that it is shared and update the database, if shared, 
         * will delete the entry from the database and show that it is unshared
         * @param {} event The event of the button click
        */
        async function handleClick(event) {
            event.preventDefault();
            if (event.target.className == "Shared ") {
                    await createSampleAtLocation(locationID);
                    setSharedState(findSampleAtlocation(id,locationID));
                    getSamplesToLocations();

            } 
            else if (event.target.className == "NotShared ") {
                await deleteSampleFromLocations(id,locationID);
                setSharedState(!sharedState);
                getSamplesToLocations();
            }
        }

        /**
         * Will check the state and return selected or "" depending if it is true or not
         * @returns {} selected if sharedState is true.
        */
        const getSharedSelected = () => { return sharedState ? "selected" : "";}

        /**
         * Will check the state and return selected or "" depending if it is true or not
         * @returns {} selected if sharedState is true.
        */
        const getNotSharedSelected = () => { return !sharedState ? "selected" : "";}
           
        // Filters locations based on passed location ID
        return (
            <div className = "locationCard">
                <p>{locationName}</p>
                <div>
                    <button type = "button" className = {`NotShared ${getNotSharedSelected()}`} onClick = {handleClick}>Not Shared</button>
                    <button type = "button" className = {`Shared ${getSharedSelected()}`} onClick = {handleClick}>Shared</button>
                </div>
            </div>
        );
 
    }

    /**
     * The component depecting multiple location cards in a list.
    */
    function LocationsList() {
        return(
            <ul className = "locationList">
                {locations.map((location) => {
                return <LocationCard locationID={location.id}
                locationName={location.location}/>})}
            </ul>
        );

    }
    
    /**
     * The component depicting the associated sample's sample card, with a preview button.
    */
    function CustomSampleCard() {
        return (
            <li className = "customSampleCard">
                <div className = "sampleCardLeftHalf">
                    <h2>{currentSample.name}</h2>
                    <p>{convertTimestamp(currentSample.datetime)}</p>
                </div>
                <div className = "sampleCardRightHalf">
                    <Preview samples={samples} sampleID = {currentSample.id} isEditing={false}
                    toneObject ={toneObject} toneTransport={toneTransport} tonePart={tonePart}/>
                </div>
            </li>
        );
    }
  
    return (
        <>
            <Template title ="Share This Sample:" logoType={"notSamples"}>
                <section className = "shareCardSection">
                    {/* On page refresh, if the samples state has retrieved the api information, then it will render the sample card */}
                    {samples[0] != undefined ? <CustomSampleCard/> : null}

                    {<LocationsList/>}
                </section>
            </Template>
        </>
    );
}



export default ShareSample;