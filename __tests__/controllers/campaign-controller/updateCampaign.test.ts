import { campaigns } from '@prisma/client';
import { getMockReq, getMockRes } from '@jest-mock/express'
import CampaignController from "../../../dist/src/controllers/campaign-controller";
import { prismaMock } from '../../singleton';
import Campaign from "../../../dist/src/models/campaign";
import { CampaignEditSchema } from "../../../dist/src/schemas/campaigns";

const { res, clearMockRes } = getMockRes({});

const today = new Date();
const tomorrow = new Date(today.getTime() + (3600 * 60 * 24));

//mock campaign
const campaign: campaigns = {
    id: 1,
    nome: 'Cold Mail Carnaval',
    dataCadastro: today,
    dataInicio: today,
    dataFim: tomorrow,
    status: 'ativa',
    categoria: 'Cold Mail',
    dataExclusao: null,
    excluido: false,
}

const leanBody = {
    nome: "TekWeek Masters",
    dataInicio: "2025-03-15",
    dataFim: "2025-02-12",
    categoria: "tekweek"
}

it("updateCampaign should have status 200", async () => {
    const updates = {
        dataInicio: tomorrow,
        dataFim: new Date(tomorrow.getTime() + (3600 * 60 * 24)),
    };

    const req = getMockReq({
        model: new Campaign(prismaMock),
        params: { id: '1' },
        body: updates
    });

    prismaMock.campaigns.findFirst.mockResolvedValue(campaign);
    prismaMock.campaigns.update.mockResolvedValue({...campaign, ...updates});

    await CampaignController.updateCampaign(req, res);

    expect(prismaMock.campaigns.update).toHaveBeenCalledWith(
        expect.objectContaining({
            data: CampaignEditSchema.safeParse(updates).data
        })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ campaign: {...campaign, ...updates} });
});

it("should fail as dataInicio cannot be greater than dataFim", async () => {
    const req = getMockReq({
        model: new Campaign(prismaMock),
        params: { id: '1' },
        body: leanBody
    });

    prismaMock.campaigns.findFirst.mockResolvedValue(campaign);

    await CampaignController.updateCampaign(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ errors: [`dataInicio cannot be greater than dataFim`] });
});

it("payload should have a dataExclusao", async () => {
    const body = {
        ...leanBody,
        dataExclusao: "2025-03-18"
    }

    expect(CampaignEditSchema.safeParse(body).data?.dataExclusao).toBeTruthy();
});

it("payload should have a dataExclusao as null", async () => {
    const body = leanBody
    expect(CampaignEditSchema.safeParse(body).data?.dataExclusao).toBeNull();
});

beforeEach(() => clearMockRes());