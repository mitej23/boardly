import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import expressWebsockets from "express-ws";
import { Server } from "@hocuspocus/server";

const server = Server.configure({
  name: "hocuspocus-fra1-01",
  timeout: 4000, // connection healthcheck interval
  debounce: 5000, // call onStoreDocument hook
  maxDebounce: 5000, // make sure to call above onStoreDocument hook atleast
  quiet: false,
  async onConfigure(data) {
    // Output some information
    console.log(`Server was configured!`);
  },
  async onConnect(data) {
    console.log(`New websocket connection: ${data.documentName}`);
  },
  async onLoadDocument() {
    console.log("Load document from server")
  },
  async connected() {
    console.log("connections:", server.getConnectionsCount());
  },
  async onStoreDocument({
    clientsCount,
    context,
    document,
    documentName,
    instance,
    requestHeaders,
    requestParameters,
    socketId,
  }) {
    console.log("On store document")
    // console.log("document", document)
    console.log("documentname ", documentName)
  },
  async onDisconnect(data) {
    // Output some information
    console.log(`client disconnected.`);
  },
});

const { app } = expressWebsockets(express());
app.set("trust proxy", true)

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))

// middlewares

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

// routes
import userRoutes from "./routes/user.routes.js"
import boardRoutes from "./routes/board.routes.js"
app.use("/api/users", userRoutes)
app.use("/api/boards", boardRoutes)
// websocket - hocuspocus
app.get("/ws-connection", (req, res) => {
  res.send({
    "connections": Server.getConnectionsCount(),
    "documents": Server.getDocumentsCount(),
  });
})
app.ws("/collaboration", (websocket, request) => {

  server.handleConnection(websocket, request); // starts websocket connection
});


export { app }