import { campaigns, Prisma } from '@prisma/client';
import { getMockReq, getMockRes } from '@jest-mock/express'
import CampaignController from "../../../dist/src/controllers/campaign-controller";
import { prismaMock } from '../../singleton';
import Campaign from "../../../dist/src/models/campaign";

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

it("deleteCampaign should have status 200", async () => {
    const req = getMockReq({
        model: new Campaign(prismaMock),
        params: { id: '1' },
    });

    const exclusionDate = new Date();
    const deletedCampaign = structuredClone(campaign);
    delete (deletedCampaign as Prisma.campaignsUpdateInput).dataExclusao;

    prismaMock.campaigns.findFirst.mockResolvedValue(campaign);
    prismaMock.campaigns.delete.mockResolvedValue({...campaign, excluido: true, dataExclusao: exclusionDate });

    await CampaignController.deleteCampaign(req, res);

    expect(prismaMock.campaigns.delete).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 1 } })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
        deleted: expect.objectContaining( {...deletedCampaign, excluido: true } )
    });
});

it("should fails to delete an unexisting campaign", async () => {
    const req = getMockReq({
        model: new Campaign(prismaMock),
        params: { id: '1' },
    });

    prismaMock.campaigns.findFirst.mockResolvedValue(null);

    await CampaignController.deleteCampaign(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ errors: ['campaign with id 1 not found'] });
});


it("should fails as soft deleting a soft deleted isn't possible", async () => {
    const req = getMockReq({
        model: new Campaign(prismaMock),
        params: { id: '1' },
        query: { soft: 'true' }
    });

    prismaMock.campaigns.findFirst.mockResolvedValue({...campaign, excluido: true, dataExclusao: new Date() });

    await CampaignController.deleteCampaign(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ errors: ['campaign with id 1 not found'] });
});

it("should call a soft delete and succeed", async () => {
    const req = getMockReq({
        model: new Campaign(prismaMock),
        params: { id: '1' },
        query: { soft: 'true' }
    });

    prismaMock.campaigns.findFirst.mockResolvedValue(campaign);

    await CampaignController.deleteCampaign(req, res);
    expect(prismaMock.campaigns.update).toHaveBeenCalledWith(
        expect.objectContaining({
            where: expect.objectContaining({ id: 1 }),
            data: expect.objectContaining({ excluido: true })
        })
    );
    expect(res.status).toHaveBeenCalledWith(200);
});

beforeEach(() => clearMockRes());