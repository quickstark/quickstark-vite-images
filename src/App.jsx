import React from "react";
import { Route, Routes } from "react-router-dom";

//Import Components
import About from "./components/About";
import { EnvProvider } from "./components/Context";
import Error from "./components/Error";
import Home from "./components/Home";
import Navigation from "./components/Navigation";

// Import Sentry
import * as Sentry from "@sentry/react";

//Function to reduce and stringify large objects
function stringifyLargeObject(obj, maxProperties = 1000) {
  // Convert the object into an array of [key, value] pairs
  const entries = Object.entries(obj);

  // Slice the entries array to keep up to maxProperties elements
  const reducedEntries = entries.slice(0, maxProperties);

  // Convert the sliced entries array back into an object
  const reducedObj = Object.fromEntries(reducedEntries);

  // Stringify the reduced object
  return JSON.stringify(reducedObj);
}

function App() {
  return (
    <>
      <EnvProvider>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/error" element={<Error />}></Route>
        </Routes>
      </EnvProvider>
    </>
  );
}

export default Sentry.withProfiler(App);
