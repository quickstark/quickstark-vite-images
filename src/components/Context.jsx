import React, { useContext, useState } from "react";

/* Create our Environment Context
   It's easier to just define this once and reuse in 
   the Components where Context is needed */

const EnvContext = React.createContext();

// Custom Hook to use our Context
export function useEnvContext() {
  return useContext(EnvContext);
}

// Fetch active backend from localStorage
function fetchActiveBackend() {
  if (localStorage.getItem("activeBackend") === null) {
    localStorage.setItem("activeBackend", "mongo");
  } else {
    return localStorage.getItem("activeBackend");
  }
}

// Provider for our Context
export function EnvProvider({ children }) {
  const [activeBackend, setActiveBackend] = useState(fetchActiveBackend);

  return (
    <EnvContext.Provider value={[activeBackend, setActiveBackend]}>
      {children}
    </EnvContext.Provider>
  );
}
