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
import { BrowserTracing } from "@sentry/tracing";

// Initialize Sentry
Sentry.init({
  // debug: true,
  dsn: import.meta.env.VITE_SENTRY_DSN, //DSN from Sentry Project Settings
  release: import.meta.env.VITE_RELEASE, //Sourcemaps are tethered to release
  environment: import.meta.env.VITE_ENVIRONMENT, //Environment
  integrations: [
    new BrowserTracing({
      // tracePropagationTargets: [import.meta.env.VITE_API_BASE_URL], //Circumvent CORS
      new Sentry.BrowserTracing(),
      new Sentry.BrowserProfilingIntegration(),
      tracePropagationTargets: ["127.0.0.1"], //Circumvent CORS
    }),
    new Sentry.Replay({
      maskAllText: false, //Mask all text
      blockAllMedia: false, //Block all media
      //blockClass: "ai_text",
      //maskTextClass: "ai_label",
    }),
  ],
  tracesSampleRate: 1.0, // Performance sample rate.
  replaysSessionSampleRate: 1.0, //Replay sample rate.
  replaysOnErrorSampleRate: 1.0, //Replay on error sample rate.

  //Callback to modify event before it is sent.
  beforeSend(event, hint) {
    console.log(JSON.stringify(event));
    return event;
  },
});

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
