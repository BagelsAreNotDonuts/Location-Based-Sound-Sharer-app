import { Link } from "react-router-dom";
import Preview from "../components/Preview";
import { convertTimestamp } from "../pages/ListOfSamples";

/**
   * Creates a sample card displaying the sample name, date last updated with buttons to preview, edit and share within.
   * @param {Object} sample The current sample object associated with the card
   * @param {int} index The index passed in from the creation of the sample card
   * @param {Object} samples The retieved api call data for samples
   * @param {toneObject} toneObject The passed Tone Object
   * @param {toneTransport} toneTransport the paseed Tone Transport
   * @param {tonePart} tonePart The pass Tone Part
   * @param {Object} samplesToLocations The retrieved api call data for samplesToLocations
   * @returns {li} A list element with other nested elements to make up the sample card
   */
function SampleCard({sample, index, samples, toneObject, toneTransport, tonePart, samplesToLocations}) {

    /**
     * Takes a sampleID and checks whether or not it has been shared to any locations
     * @param {string} sampleID The sampleID of the relevant sample
     * @returns {string} "Shared" or "Share" depending on if the sampleID has been found in the database or not
   */
    function checkSampleShared(sampleID) {
        let filteredSamples = samplesToLocations.filter((entry) => (sampleID == entry.samples_id));
        return filteredSamples[0] != undefined ? "Shared" : "Share";
    }

    return(
    <li key = {index} className = "sampleCard">
        <div className = "sampleCardLeftHalf">
            <h2>{sample.name}</h2>
            <p>{convertTimestamp(sample.datetime)}</p>
        </div>
        <div className = "sampleCardRightHalf">
            <Link to = {`/share-sample/${sample.id}`}>
                 <button className = {`shareButton${` `+checkSampleShared(sample.id)}`}>{checkSampleShared(sample.id)}</button>
            </Link>
            <Preview key={index} samples={samples} sampleID = {sample.id} isEditing={false}
            toneObject ={toneObject} toneTransport={toneTransport} tonePart={tonePart}/>
            <Link to = {`/edit-sample/${sample.id}`}>
                <button className = "editButton">Edit</button>
            </Link>
        </div>
    </li>
    )
}
export default SampleCard;