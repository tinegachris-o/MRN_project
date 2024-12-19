import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
const client = new ApolloClient({
  //TODO UPDATE URL ON PRODUCTION
  uri: "http://localhost:8000/graphql", // Replace with your GraphQL API endpoint
  cache: new InMemoryCache(),
  credentials:"include"
});
import { BrowserRouter } from "react-router-dom";
import GridBackground from "./components/ui/GridBackground.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
        <ApolloProvider client={client}>

    <BrowserRouter>
      <GridBackground>
        <App />
      </GridBackground>
    </BrowserRouter>
    </ApolloProvider>
  </StrictMode>
);
