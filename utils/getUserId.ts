import { IncomingMessage, ServerResponse } from "http";
import { isValidUUID } from "./isValidUUID";
import { HttpError } from "../httpError";

export const getUserId = (
  req: IncomingMessage,
  res: ServerResponse
): string | never => {
  const id = req.url?.split("/")[3];
  if (!id || !isValidUUID(id)) {
    throw new HttpError(400, "Invalid userId");
  }

  return id;
};
