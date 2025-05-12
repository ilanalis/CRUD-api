import { ServerResponse } from "http";

export const sendResponse = (
  res: ServerResponse,
  statusCode: number,
  message?: string | object
) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(message));
};
