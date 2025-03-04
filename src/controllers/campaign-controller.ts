import { Request, Response } from "express";
import isStringParseableToInt from "../validators/string-parseable-to-int.js";
import Campaign from "models/campaign.js";
import { CampaignEditSchema, CampaignSchema, CampaingIdSchema, } from "../schemas/campaigns.js";
import checkDataFimGTDataInicio from "../validators/datafim-gt-datainicio.js";
import checkDataInicioGTENow from "../validators/datainicio-gte-now.js";
import validateOptionalBool from "../validators/validate-optional-bool.js";

class CampaignController {
    static returnErrorIfModelNotDefined(req: Request, res: Response) {
        if(req.model) return false;
        return res.status(500).json({ errors: ['something went wrong'] });
    }

    static async listCampaigns(req: Request, res: Response) {
        const model = req.model as Campaign;
        const { page, limit } = req.query;
        
        const errors: string[] = [];

        if(CampaignController.returnErrorIfModelNotDefined(req, res)) return;

        if(limit && !isStringParseableToInt(limit as string)) {
            errors.push("limit must be a valid number"); 
        }

        if(page) {
            if (isStringParseableToInt(page as string) && parseInt(page as string) < 1) {
                errors.push("page must be greater than or equal to 1");
            }
            if (!isStringParseableToInt(page as string)) errors.push("page must be a valid number");
        }


        if(errors.length > 0) {
            res.status(400).json({ errors });
            return;
        }
        
        const units = parseInt(limit as string) || 20;
        const offset = parseInt(page as string) * units - units || 0;

        const campaigns = await model.getCampaigns(units, offset);

        res.status(200).json({ campaigns });
    }

}

export default CampaignController;