import { getMockReq, getMockRes } from '@jest-mock/express'
import CampaignController from "../../../dist/src/controllers/campaign-controller";
import { prismaMock } from '../../singleton';
import Campaign from "../../../dist/src/models/campaign";

const { res, clearMockRes } = getMockRes({});

it("listCampaigns should have status 200", async () => {
    const req = getMockReq({
        model: new Campaign(prismaMock)
    });

    await CampaignController.listCampaigns(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
})

it("listCampaigns should have status 400", async () => {
    const req = getMockReq({
        model: new Campaign(prismaMock),
        query: {
            page: "one bauhaus",
            limit: "a bauhaus"
        }
    });

    await CampaignController.listCampaigns(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
})

beforeEach(() => clearMockRes());