import { Request, Response, NextFunction } from "express";
import app from "../../app";

interface CustomError extends Error {
  name: string;
}

class ValidationError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = "ValidationError";
  }
}

class NotFoundError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = "NotFoundError";
  }
}

class AuthenticationError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = "AuthenticationError";
  }
}

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error stack trace for debugging

  if (err instanceof ValidationError) {
    // This is a validation error, return a 400 status code with the validation error message
    return res.status(400).send({ error: err.message });
  }

  if (err instanceof NotFoundError) {
    // This is a not found error, return a 404 status code with the not found error message
    return res.status(404).send({ error: err.message });
  }

  if (err instanceof AuthenticationError) {
    // This is an authentication error, return a 401 status code with the authentication error message
    return res.status(401).send({ error: err.message });
  }

  // This is an unknown error, return a 500 status code with a generic error message
  return res.status(500).send({ error: "An unexpected error occurred" });
});
