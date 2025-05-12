import { IncomingMessage, ServerResponse } from "http";
import { isValidUUID } from "./utils/isValidUUID";
import { DataBase } from "./data";
import { HttpError } from "./httpError";

export const getUser = async (
  id: string,
  res: ServerResponse,
  db: DataBase
): Promise<User> => {
  const user = db.getUser(id);
  if (!user) {
    throw new HttpError(404, "User doesn't exist");
  }

  return user;
};

export const postUser = async (
  req: IncomingMessage,
  db: DataBase
): Promise<User> => {
  const body = await new Promise<string>((resolve, reject) => {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk.toString();
    });

    req.on("end", () => {
      resolve(data);
    });

    req.on("error", (err) => {
      reject(err);
    });
  });

  let bodyData;
  try {
    bodyData = JSON.parse(body);
  } catch {
    throw new HttpError(400, "Invalid JSON");
  }

  const { username, age, hobbies } = bodyData;
  const requiredFields = ["username", "age", "hobbies"];
  const missingFields = requiredFields.filter((field) => !bodyData[field]);

  if (missingFields.length > 0) {
    throw new HttpError(
      400,
      `Missing required fields: ${missingFields.join(", ")}`
    );
  }

  return db.createUser({ username, age, hobbies });
};

export const putUser = async (
  req: IncomingMessage,
  db: DataBase,
  id: string
): Promise<User> => {
  const body = await new Promise<string>((resolve, reject) => {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk.toString();
    });

    req.on("end", () => {
      resolve(data);
    });

    req.on("error", (err) => {
      reject(err);
    });
  });

  let bodyData;
  try {
    bodyData = JSON.parse(body);
  } catch {
    throw new HttpError(400, "Invalid JSON");
  }
  const user = db.getUser(id);

  if (!user) {
    throw new HttpError(404, "User doesn't exist");
  }

  return db.updateUser(id, bodyData);
};

export const deleteUser = (res: ServerResponse, db: DataBase, id: string) => {
  const user = db.getUser(id);

  if (!user) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "User doesn't exist" }));
    return;
  }

  db.deleteUser(id);
  return;
};

interface User {
  username: string;
  age: number;
  hobbies: string[];
}
