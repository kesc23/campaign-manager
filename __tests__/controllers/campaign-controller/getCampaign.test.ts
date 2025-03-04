import { getMockReq, getMockRes } from '@jest-mock/express'
import CampaignController from "../../../dist/src/controllers/campaign-controller";
import { prismaMock } from '../../singleton';
import { campaigns } from '@prisma/client';
import Campaign from "../../../dist/src/models/campaign";

const { res, clearMockRes } = getMockRes({});

const mockfindFirst = async (args: { where?: { id?: { equals?: number }}}) => {
    if (args?.where?.id?.equals != 1) return null;
    return campaign;
}

//mock campaign
const campaign: campaigns = {
    id: 1,
    nome: 'Cold Mail Carnaval',
    dataCadastro: new Date('2025-02-27'),
    dataInicio: new Date('2025-02-27'),
    dataFim: new Date('2025-03-05'),
    status: 'ativa',
    categoria: 'Cold Mail',
    dataExclusao: null,
    excluido: false,
}

it("getCampaign with defined id should return campaign", async () => {
    const req = getMockReq({
        model: new Campaign(prismaMock),
        params: { id: '1' }
    });

    prismaMock.campaigns.findFirst.mockImplementation(mockfindFirst as typeof prismaMock.campaigns.findFirst);

    await CampaignController.getCampaign(req, res);

    const param = {
        where: { id: { equals: parseInt(req.params.id) } }
    };

    await expect(prismaMock.campaigns.findFirst).toHaveBeenCalledWith(param);
    await expect(prismaMock.campaigns.findFirst(param)).resolves.toEqual(campaign);
});

it("getCampaign with unmatching id should fail", async () => {
    const req = getMockReq({
        model: new Campaign(prismaMock),
        params: { id: '2' }
    });
    
    prismaMock.campaigns.findFirst.mockImplementation(mockfindFirst as typeof prismaMock.campaigns.findFirst);

    await CampaignController.getCampaign(req, res);

    const param = {
        where: { id: { equals: parseInt(req.params.id) } }
    };

    await expect(prismaMock.campaigns.findFirst).toHaveBeenCalledWith(param);
    await expect(prismaMock.campaigns.findFirst(param)).resolves.toBe(null);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
            errors: [`campaign with id 2 not found`]
        })
    );
});

it("getCampaign with id null should fail", async () => {
    const req = getMockReq({
        model: new Campaign(prismaMock),
        params: {}
    });
    
    //@ts-expect-error will throw error because of function args
    prismaMock.campaigns.findFirst.mockImplementation(mockfindFirst);

    await CampaignController.getCampaign(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
            errors: ["Expected number, received nan"]
        })
    );
});

beforeEach(() => clearMockRes());