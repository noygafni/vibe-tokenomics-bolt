import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { SessionContextProvider } from '@supabase/auth-helpers-react';

import { createClient } from '@supabase/supabase-js';

// Create the client
const supabase = createClient(
  import.meta.env.VITE_SITE_CLIENT!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
    <App />
    </SessionContextProvider>
  </React.StrictMode>
);
