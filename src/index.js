import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./pages/App";
import SampleEdit from "./pages/SampleEdit";
import { useState, useEffect } from "react";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <>
    <App></App>
  </>
);
