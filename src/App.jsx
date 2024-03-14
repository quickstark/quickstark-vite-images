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

// Initialize Sentry
Sentry.init({
  // debug: true,
  dsn: import.meta.env.VITE_SENTRY_DSN, //DSN from Sentry Project Settings
  release: import.meta.env.VITE_RELEASE, //Sourcemaps are tethered to release
  environment: import.meta.env.VITE_ENVIRONMENT, //Environment
  integrations: [
    new Sentry.BrowserTracing({
      // tracePropagationTargets: [import.meta.env.VITE_API_BASE_URL], //Circumvent CORS
      tracePropagationTargets: [
        "127.0.0.1",
        "https://quickstark-fastapi-images.up.railway.app/",
      ], //Circumvent CORS
    }),
    new Sentry.BrowserProfilingIntegration(),
    new Sentry.Replay({
      maskAllText: false, //Mask all text
      blockAllMedia: false, //Block all media
      mask: [".label_container", ".ai_label"], //Mask class
      unmask: [".unmask-me"], //Unmask class
    }),
    Sentry.feedbackIntegration({
      // Additional SDK configuration goes in here, for example:
      colorScheme: "system",
    }),
  ],
  tracesSampleRate: 1.0, // Performance sample rate.
  replaysSessionSampleRate: 1.0, //Replay sample rate.
  replaysOnErrorSampleRate: 1.0, //Replay on error sample rate.
  profilesSampleRate: 1.0, //Profile sample rate.
  //Callback to modify event before it is sent.
  beforeSend(event, hint) {
    console.log(console.log(stringifyLargeObject(event, 1000)));
    return event;
  },
});

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
