import { PrismaClient } from "@prisma/client";
import BaseModel from "./base-model.js";
import { Prisma } from "@prisma/client";

export default class Campaign implements BaseModel {
    client: PrismaClient;

    constructor(client: PrismaClient) {
        this.client = client;
    }

}