import http, { IncomingMessage, Server, ServerResponse } from "http";
import { DataBase } from "./data";
import { RequestMethods } from "./types";
import dotenv from "dotenv";
import { getUserId } from "./utils/getUserId";
import { deleteUser, getUser, postUser, putUser } from "./userController";
import { sendResponse } from "./utils/sendResponse";
import { HttpError } from "./httpError";
dotenv.config();

const port = process.env.PORT;

const db: DataBase = new DataBase();

const server: Server = http.createServer(function (
  req: IncomingMessage,
  res: ServerResponse
) {
  try {
    if (req.url === "/api/users" && req.method === RequestMethods.Get) {
      sendResponse(res, 200, db.getAllUsers());
      return;
    }

    if (
      req.url?.match(/^\/api\/users\/[^/]+$/) &&
      req.method === RequestMethods.Get
    ) {
      const id = getUserId(req, res);
      getUser(id, res, db)
        .then((user) => {
          sendResponse(res, 200, user);
        })
        .catch((error) => {
          if (error instanceof HttpError) {
            sendResponse(res, error.statusCode, error.message);
          } else {
            sendResponse(res, 500, "Internal Server Error");
          }
        });
      return;
    }

    if (req.url === "/api/users" && req.method === RequestMethods.Post) {
      postUser(req, db)
        .then((user) => {
          sendResponse(res, 201, user);
        })
        .catch((error) => {
          if (error instanceof HttpError) {
            sendResponse(res, error.statusCode, error.message);
          } else {
            sendResponse(res, 500, "Internal Server Error");
          }
        });
      return;
    }

    if (
      req.url?.match(/\/api\/users\/\w+/) &&
      req.method === RequestMethods.Put
    ) {
      const id = getUserId(req, res);
      if (!id) return;

      putUser(req, db, id)
        .then((user) => {
          sendResponse(res, 200, user);
        })
        .catch((error) => {
          if (error instanceof HttpError) {
            sendResponse(res, error.statusCode, error.message);
          } else {
            sendResponse(res, 500, "Internal Server Error");
          }
        });
      return;
    }

    if (
      req.url?.match(/\/api\/users\/\w+/) &&
      req.method === RequestMethods.Delete
    ) {
      const id = getUserId(req, res);
      deleteUser(res, db, id);
      return sendResponse(res, 204);
    }
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  } catch (error) {
    if (error instanceof HttpError) {
      sendResponse(res, error.statusCode, error.message);
      return;
    }
    sendResponse(res, 500, "Internal Server Error");
  }
});

server.listen(port, () => {
  console.log("Server is listening on port " + port);
});
