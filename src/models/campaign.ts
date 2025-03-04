import { PrismaClient } from "@prisma/client";
import BaseModel from "./base-model.js";
import { Prisma } from "@prisma/client";

export default class Campaign implements BaseModel {
    client: PrismaClient;

    constructor(client: PrismaClient) {
        this.client = client;
    }

    async getCampaigns(limit: number, offset: number) {
        return this.client.campaigns.findMany({
            take: limit,
            skip: offset
        })
    }

    async getCampaign(id: number) {
        return this.client.campaigns.findFirst({ where: { id: {equals: id}} });
    }

    async storeCampaign(data: Prisma.campaignsUncheckedCreateInput ) {
        return this.client.campaigns.create({ data });
    }

    async updateCampaign(id: number, data: Prisma.campaignsUncheckedUpdateInput ) {
        return this.client.campaigns.update({ where: { id }, data: data });
    }

}