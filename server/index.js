import http from "http";
import cors from "cors";
import express from "express";
import { configPassport } from "./PassPort/passportConfig.js";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import passport from "passport";
import session from "express-session";
import ConnectMongo from "connect-mongodb-session";
import { buildContext } from "graphql-passport";
import { ApolloServer } from "@apollo/server";
import mergedTypeDefs from "./typeDefs/index.js";
import mergedResolvers from "./resolvers/index.js";
import { connectDB } from "./db/connection.js";
///package.json is located on graphql
const app = express();
const httpServer = http.createServer(app);
let port = process.env.PORT;
const __dirname = path.resolve();
// Configure Passport
configPassport();

// Middlewares
app.use(express.json());
await connectDB();

// Configure MongoDB session store
const mongoDBStore = ConnectMongo(session);
const store = new mongoDBStore({
  uri: process.env.CLOUD_MONGO_URL,
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
    context: async ({ req, res }) => {
      const context = buildContext({ req, res });
      return {
        ...context,
        getUser: context.getUser, // Ensure getUser is explicitly available
      };
    },
  })
);

//npm build will build application

//// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something went wrong");
});
app.use(express.static(path.join(__dirname, "client/dist")));
// Start the HTTP server
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", index.html));
});
httpServer.listen(port, () => {
  console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
});
