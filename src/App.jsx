import React from "react";
import { Route, Routes } from "react-router-dom";
import { Grid, GridItem } from "@chakra-ui/react";
import Home from "./components/Home";

import * as Sentry from "@sentry/react";

import { BrowserTracing } from "@sentry/tracing";
import { createBrowserHistory } from "history";
import About from "./components/About";
import Navigation from "./components/Navigation";
import Error from "./components/Error";
const history = createBrowserHistory();

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  release: import.meta.env.VITE_RELEASE, //Need the release for sourcemaps
  integrations: [
    new BrowserTracing(),
    new Sentry.Replay({
      maskAllText: false,
      blockAllMedia: false,
      //blockClass: "ai_text",
      maskTextClass: "ai_label",
    }),
  ],

  // routingInstrumentation: Sentry.reactRouterV5Instrumentation(history),
  tracesSampleRate: 1.0,

  // This sets the Replay sample rate. You may want this to be 100% while
  // in development and perhaps lower in production
  replaysSessionSampleRate: 1.0,

  // If the entire session is not sampled, use the below sample rate to sample
  // sessions when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  beforeSend(event, hint) {
    // Just logging to console for reference
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
