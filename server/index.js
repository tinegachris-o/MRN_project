import http from "http";
import cors from "cors";
import express from "express";
import { configPassport } from "./PassPort/passportConfig.js";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import session from "express-session";
import ConnectMongo from "connect-mongodb-session";
import { buildContext } from "graphql-passport";
import { ApolloServer } from "@apollo/server";
import mergedTypeDefs from "./typeDefs/index.js";
import mergedResolvers from "./resolvers/index.js";
import { connectDB } from "./db/connection.js";

const app = express();
const httpServer = http.createServer(app);
let port = process.env.PORT;

// Configure Passport
configPassport();

// Middlewares
app.use(express.json());
await connectDB();

// Configure MongoDB session store
const mongoDBStore = ConnectMongo(session);
const store = new mongoDBStore({
  uri: process.env.MONGO_URL,
  collection: "sessions",
});
store.on("error", (error) => {
  console.error(error);
});

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
    store: store,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Configure Apollo Server
const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

// Apply CORS middleware specifically for `/graphql`
app.use(
  "/graphql",
  cors({
    origin: "http://localhost:3000", // Correct origin
    credentials: true, // Allow cookies
  }),
  expressMiddleware(server, {
    context: async ({ req, res }) => buildContext({ req, res }),
  })
);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something went wrong");
});

// Start the HTTP server
httpServer.listen(port, () => {
  console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
});
