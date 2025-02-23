import React from "react";
import { Link } from "react-router-dom";

/**
   * Creates a header component
   * @param {string} logoType  If "samples" is passed, will not add an arrow to the logo, else there will be an arrow appended to the logo
   * @returns {header} A header element with a link back to the root page, as well as a description 
   */

export default function Header({logoType}) {

    //Appends/doesn't append the arrow depending on the logot type
    let arrow = "← ";
    if (logoType == "samples") {
        arrow = "";
    }
    
    let descText = "Create & Share Samples, Listen in Mobile App!";
    return (
        <header className = "page-header">

            <Link className="logoLink" to="/">
                <h1 className = "logo" >{arrow}OgCiSum</h1>
            </Link>
            <p className = "headerDescText">
                {descText}
            </p>


        </header>
    );

}