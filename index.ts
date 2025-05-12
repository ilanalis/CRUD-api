import http, { IncomingMessage, Server, ServerResponse } from "http";
import { DataBase } from "./data";
import { RequestMethods } from "./types";
import dotenv from "dotenv";
import { isValidUUID } from "./utils/isValidUUID";
dotenv.config();

const port = process.env.PORT;

const db: DataBase = new DataBase();

const server: Server = http.createServer(function (
  req: IncomingMessage,
  res: ServerResponse
) {
  if (req.url === "/api/users" && req.method === RequestMethods.Get) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(db.getAllUsers()));
    return;
  }
  if (
    req.url?.match(/^\/api\/users\/[^/]+$/) &&
    req.method === RequestMethods.Get
  ) {
    const id = req.url.split("/")[3];
    const user = db.getUser(id);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user));
    return;
  }
  if (req.url === "/api/users" && req.method === RequestMethods.Post) {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      let bodyData;
      try {
        bodyData = JSON.parse(body);
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid JSON" }));
        return;
      }

      const { username, age, hobbies } = bodyData;

      const user = db.createUser({ username, age, hobbies });
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(user));
    });
    return;
  }
  if (
    req.url?.match(/\/api\/users\/\w+/) &&
    req.method === RequestMethods.Put
  ) {
    const id = req.url.split("/")[3];

    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      let bodyData;
      bodyData = JSON.parse(body);

      const updatedUser = db.updateUser(id, bodyData);
      if (!updatedUser) return;

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(updatedUser));
      return;
    });
    return;
  }
  if (
    req.url?.match(/\/api\/users\/\w+/) &&
    req.method === RequestMethods.Delete
  ) {
    const id = req.url.split("/")[3];

    res.writeHead(204, { "Content-Type": "application/json" });
    res.end(JSON.stringify(db.deleteUser(id)));
    return;
  }
});

server.listen(port, () => {
  console.log("Server is listening on port " + port);
});
