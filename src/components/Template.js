import React from "react";
import Header from "./Header";
import Footer from "./Footer";

/**
   * A base template to be used for the pages containing the header and footer
   * @param {string} title The title header to be used for the page
   * @param {any} children All the elements between the header and footer
   * @param {string} logoType If "samples" is passed, will not add an arrow to the logo, else there will be an arrow appended to the logo
   * @returns {<>} The elements for header and footer, with the children inbetween 
   */
function Template({ title, children, logoType }) {
    return (
        <>
            <Header logoType = {logoType}></Header>
            <main>
                <h2 className = "template-title">{title}</h2>
                {children}
                <Footer></Footer>
            </main>
        </>
    );
}

export default Template;