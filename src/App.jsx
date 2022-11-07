import React from "react";
import { Route, Routes } from "react-router-dom";
import { Grid, GridItem } from "@chakra-ui/react";
import Home from "./components/Home";

import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { createBrowserHistory } from "history";
import About from "./components/About";
import Navigation from "./components/Navigation";
const history = createBrowserHistory();

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  release: "quickstark-react-images@0.0.1", //Need the release for sourcemaps
  integrations: [new BrowserTracing()],
  routingInstrumentation: Sentry.reactRouterV5Instrumentation(history),
  tracesSampleRate: 1.0,
  beforeSend(event, hint) {
    // Check if it is an exception, and if so, show the report dialog
    console.log(event, hint);

    if (event.exception.values[0].value == "Unhandled Error") {
      Sentry.showReportDialog({ eventId: event.event_id });
    }
    return event;
  },
});

Sentry.configureScope((scope) => scope.setTransactionName("Home"));

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/about" element={<About />}></Route>
      </Routes>
    </>
  );
}

export default Sentry.withProfiler(App);
