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

}

export default CampaignController;