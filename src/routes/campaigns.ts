import { Request, Response, Router } from "express";
import prisma from "../singletons/db.js";
import CampaignController from "../controllers/campaign-controller.js";
import Campaign from "../models/campaign.js";

type ControllerMethod = (rq: Request, rs: Response) => unknown;

const router = Router();

router.use((req, _, next) => {
    req.model = new Campaign(prisma);
    next();
});

const catcher = (func: ControllerMethod) => async (req: Request, res: Response) => {
    try {
        await func(req, res);
    } catch(err) {
        console.error(err);
        res.status(500).json({ errors: ["something went wrong"] });
    }
}

router.get('/', catcher(CampaignController.listCampaigns));
router.get('/:id', catcher(CampaignController.getCampaign));
router.post('/', catcher(CampaignController.addCampaign));
router.patch('/:id', catcher(CampaignController.updateCampaign));
router.delete('/:id', catcher(CampaignController.deleteCampaign));

export default router;