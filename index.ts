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
  try {
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
      if (!isValidUUID(id)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid userId format" }));
        return;
      }

      const user = db.getUser(id);

      if (!user) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "User doesn't exist" }));
        return;
      }
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
        const requiredFields = ["username", "age", "hobbies"];

        const missingFields = requiredFields.filter(
          (field) => !bodyData[field]
        );

        if (missingFields.length > 0) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: `Missing required fields: ${missingFields.join(", ")}`,
            })
          );
          return;
        }
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
        try {
          bodyData = JSON.parse(body);
        } catch {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Invalid JSON" }));
          return;
        }

        if (!isValidUUID(id)) {
          console.log("not valid");
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Invalid userId format" }));
          return;
        }
        const user = db.getUser(id);

        if (!user) {
          console.log("user dosnt exist");

          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "User doesn't exist" }));
          return;
        }

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

      if (!isValidUUID(id)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid userId format" }));
        return;
      }
      const user = db.getUser(id);

      if (!user) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "User doesn't exist" }));
        return;
      }

      res.writeHead(204, { "Content-Type": "application/json" });
      res.end(JSON.stringify(db.deleteUser(id)));
      return;
    }
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  } catch (error) {
    console.log("error", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
});

server.listen(port, () => {
  console.log("Server is listening on port " + port);
});
