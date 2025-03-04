import BaseModel from "models/base-model.ts";

declare global {
  namespace Express {
    interface Request {
      model?: BaseModel;
    }
  }
}