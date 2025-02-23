
import { useState, useEffect } from "react";
import ListOfSamples from "./ListOfSamples";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SampleEdit from "./SampleEdit";
import { toneObject, toneTransport, tonePart } from "../data/instruments.js";
import ShareSample from "./ShareSample"

/**
   * The level which aggregates all the api calls and sets the useStates for them. Also sets up routes.
   * @returns {BrowserRouter} The browser routes for the routes to pages 
   */
function App() {

  //http://wmp.interaction.courses/api/v1/?apiKey=CnGp1NRD&mode=read&endpoint=samples


  
  const [samples, setSamples] = useState([]);
  const [locations, setLocations] = useState([]);
  const [samplesToLocations, setSamplesToLocations] = useState([]);

  useEffect(() => {
    getSamples();
    getLocations();
    getSamplesToLocations();
  },[]);

  /**
   * Updates the samples useState by making an api call and setting it to the state
   * @returns {} 
   */
  async function getSamples() {
    const response = await fetch("http://wmp.interaction.courses/api/v1/?apiKey=CnGp1NRD&mode=read&endpoint=samples");
    const json = await response.json();
    const retreivedSamples = json.samples;
    setSamples(retreivedSamples);
  }

  /**
   * Updates the locations useState by making an api call and setting it to the state
   * @returns {} 
   */
  async function getLocations() {
    const response = await fetch("http://wmp.interaction.courses/api/v1/?apiKey=CnGp1NRD&mode=read&endpoint=locations");
    const json = await response.json();
    const locations = json.locations;
    setLocations(locations);
  }

  /**
   * Updates the samplesToLocations useState by making an api call and setting it to the state
   * @returns {} 
   */
  async function getSamplesToLocations() {
    const response = await fetch("http://wmp.interaction.courses/api/v1/?apiKey=CnGp1NRD&mode=read&endpoint=samples_to_locations");
    const json = await response.json();
    const samplesToLocations = json.samples_to_locations;
    setSamplesToLocations(samplesToLocations);
  }


  
  return (
    <>
      <BrowserRouter>
            <Routes>
              <Route path="/" element={<ListOfSamples samples={samples} samplesToLocations = {samplesToLocations} />} />
              <Route path="/edit-sample/:id" element={<SampleEdit samples = {samples} toneObject={toneObject} toneTransport={toneTransport} 
              tonePart={tonePart} getSamples={getSamples}  />} />
              <Route path="/create-sample" element={<SampleEdit samples = {samples} toneObject={toneObject} toneTransport={toneTransport}
              tonePart={tonePart} getSamples={getSamples} />} />
              <Route path="/share-sample/:id" element={<ShareSample samples={samples} locations={locations} 
              samplesToLocations = {samplesToLocations} getSamplesToLocations = {getSamplesToLocations}  />} />
            </Routes>
      </BrowserRouter>
    
    </>

  );
}

export default App;
