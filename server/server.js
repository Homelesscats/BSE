const express = require("express");
//TODO: Implement the Apollo Server and apply it to the Express server as middleware.
const { ApolloServer } = require("apollo-server-express");
const { authMiddleware } = require("./utils/auth");

const path = require("path");
const db = require("./config/connection");

const { typeDefs, resolvers } = require("./schemas");

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/")); // Send the main HTML file of the React app.
});

// Start the Apollo Server and the Express server.
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start(); // Start the Apollo Server.
  server.applyMiddleware({ app });

  db.once("open", () => {
    // Once the database connection is open:
    app.listen(PORT, () => {
      // Start the Express server to listen on the specified port.
      console.log(`API server running on port ${PORT}!`);
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};

startApolloServer(typeDefs, resolvers); // Start the Apollo Server and the Express server.
// Start the Apollo Server and Express server.
