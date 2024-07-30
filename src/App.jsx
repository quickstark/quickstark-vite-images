import React from "react";
import { Route, Routes } from "react-router-dom";
import { datadogRum } from '@datadog/browser-rum';

//Import Components
import About from "./components/About";
import { EnvProvider } from "./components/Context";
import Error from "./components/Error";
import Home from "./components/Home";
import Navigation from "./components/Navigation";

const applicationId = import.meta.env.VITE_DATADOG_APPLICATION_ID;
const clientToken = import.meta.env.VITE_DATADOG_CLIENT_TOKEN;
const site = import.meta.env.VITE_DATADOG_SITE;
const service = import.meta.env.VITE_DATADOG_SERVICE;
const env = import.meta.env.VITE_ENVIRONMENT;
const release = import.meta.env.VITE_RELEASE;

console.log(`Application ID: ${applicationId}`);
console.log(`Client Token: ${clientToken}`);

datadogRum.init({
    applicationId: applicationId,
    clientToken: clientToken,
    site: site,
    service: service,
    env: env,
    version: release, 
    sessionSampleRate: 100,
    sessionReplaySampleRate: 100,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'allow',
    allowedTracingUrls: ["https://stxwt5g7ffjwgrqzyzgkkj3psq0fuokw.lambda-url.us-west-1.on.aws/", "https://quickstark-fastapi.up.railway.app/",(url) => url.startsWith("http://localhost")]
});

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

export default App;
