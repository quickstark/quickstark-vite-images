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
      blockClass: "chakra-heading",
    }),
  ],
  // routingInstrumentation: Sentry.reactRouterV5Instrumentation(history),
  tracesSampleRate: 1.0,
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.5,
  // If the entire session is not sampled, use the below sample rate to sample
  // sessions when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  beforeSend(event, hint) {
    // Check if it is an exception, and if so, show the report dialog
    console.log(event, hint);

    // if (event.exception.values[0].value == "Unhandled Error") {
    //   Sentry.showReportDialog({ eventId: event.event_id });
    // }
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
