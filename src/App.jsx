import React from "react";
import { Route, Routes } from "react-router-dom";

//Import Components
import About from "./components/About";
import Error from "./components/Error";
import Home from "./components/Home";
import Navigation from "./components/Navigation";

// Import Sentry
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

// Initialize Sentry
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN, //DSN from Sentry Project Settings
  release: import.meta.env.VITE_RELEASE, //Sourcemaps are tethered to release
  _experiments: {
    enableInteractions: true, //Experimental feature to enable page-level XHR interactions
  },
  integrations: [
    new BrowserTracing({
      tracePropagationTargets: [import.meta.env.VITE_API_BASE_URL], //Circumvent CORS
    }),
    new Sentry.Replay({
      maskAllText: false, //Obfuscate all text
      blockAllMedia: false, //Obfuscate all media
      //blockClass: "ai_text",
      //maskTextClass: "ai_label",
    }),
  ],
  // This sets the Transaction sample rate. You may want this to be 100% while
  // in development and perhaps lower in production
  tracesSampleRate: 1.0, 

  // This sets the Replay sample rate. You may want this to be 100% while
  // in development and perhaps lower in production
  replaysSessionSampleRate: 1.0,

  // If the entire session is not sampled, use the below sample rate to sample
  // sessions when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  beforeSend(event, hint) { //This is a callback function that allows you to modify the event before it is sent to Sentry.
    console.log(event, hint);
    return event;
  },
});

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/error" element={<Error />}></Route>
      </Routes>
    </>
  );
}

export default Sentry.withProfiler(App);
