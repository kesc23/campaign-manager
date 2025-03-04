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

    static async getCampaign(req: Request, res: Response) {
        if(CampaignController.returnErrorIfModelNotDefined(req, res)) return;

        const model  = req.model as Campaign;
        const { id } = req.params;
        const errors: string[] = [];

        const {success, error, data: parsedId } = CampaingIdSchema.safeParse(id);

        if(!success) {
            error.errors.forEach(e => errors.push(`${e.message}`));
            return res.status(400).json({ errors });
        }

        const campaign = await model.getCampaign(parsedId);

        if(!campaign) {
            errors.push(`campaign with id ${parsedId} not found`)
            return res.status(404).json({ errors });
        }

        res.status(200).json({ campaign })
    }

    static async addCampaign(req: Request, res: Response) {
        if(CampaignController.returnErrorIfModelNotDefined(req, res)) return;

        const model  = req.model as Campaign;

        const errors: string[] = [];

        const {success, error, data: payload} = CampaignSchema.safeParse(req.body);

        if(!success) {
            error.errors.forEach(e => errors.push(`${e.path.pop()}: ${e.message}`));
            return res.status(400).json({ errors });
        }
        
        if(payload.dataInicio && payload.dataFim ){
            const isValid = checkDataFimGTDataInicio(new Date(payload.dataInicio), new Date(payload.dataFim));
            if(true !== isValid) errors.push(isValid)
        }

        const isValid = checkDataInicioGTENow(new Date(payload.dataInicio));
        if(true !== isValid) errors.push(isValid)

        if(errors.length > 0) return res.status(400).json({ errors });

        try { 
            const campaign = await model.storeCampaign(payload);
            
            res.status(201).json({ campaign })
        } catch(err) {
            console.error(err);
            res.status(500).json({ errors: ['something went wrong'] });
        }
    }

    static async updateCampaign(req: Request, res: Response) {
        if(CampaignController.returnErrorIfModelNotDefined(req, res)) return;
        const model   = req.model as Campaign;
        const { id }  = req.params;
        const errors: string[] = [];

        const {success: idSuccess, error: idError, data: parsedId } = CampaingIdSchema.safeParse(id);

        if(!idSuccess) {
            idError.errors.forEach(e => errors.push(`${e.message}`));
            return res.status(400).json({ errors });
        }

        const current = await model.getCampaign(parsedId);

        if( !current ) {
            return res.status(404).json({ errors: [`campaign with id ${parsedId} not found`] });
        } 

        const {success, error, data: payload} = CampaignEditSchema.safeParse(req.body);

        if(!success) {
            error.errors.forEach(e => errors.push(`${e.path.pop()}: ${e.message}`));
            return res.status(400).json({ errors });
        }

        if(payload.dataInicio && payload.dataFim ){
            const isValid = checkDataFimGTDataInicio(new Date(payload.dataInicio), new Date(payload.dataFim));
            if(true !== isValid) errors.push(isValid)
        }
    
        if(payload.dataInicio && !payload.dataFim ){
            const isValid = checkDataFimGTDataInicio(new Date(payload.dataInicio), new Date(current.dataFim));
            if(true !== isValid) errors.push(isValid)
        }

        if(!payload.dataInicio && payload.dataFim ){
            const isValid = checkDataFimGTDataInicio(new Date(current.dataInicio), new Date(payload.dataFim));
            if(true !== isValid) errors.push(isValid)
        }

        if(errors.length > 0) return res.status(400).json({ errors });

        try { 
            const campaign = await model.updateCampaign(parsedId, payload);
            res.status(200).json({ campaign })
        } catch(err) {
            console.error(err);
            res.status(500).json({ errors: ['something went wrong'] });
        }
    }

    static async deleteCampaign(req: Request, res: Response) {
        if(CampaignController.returnErrorIfModelNotDefined(req, res)) return;
        const model   = req.model as Campaign;
        const { id }  = req.params;
        const { soft }  = req.query;
        const errors: string[] = [];

        const {success: softSuccess, error: softError, data: parsedsoft } = validateOptionalBool( soft as boolean | null | undefined ?? false );

        if(!softSuccess) {
            softError.errors.forEach(e => errors.push(`${e.message}`));
            return res.status(400).json({ errors });
        }

        const {success: idSuccess, error: idError, data: parsedId } = CampaingIdSchema.safeParse(id);

        if(!idSuccess) {
            idError.errors.forEach(e => errors.push(`${e.message}`));
            return res.status(400).json({ errors });
        }

        const current = await model.getCampaign(parsedId);

        if( !current ) {
            return res.status(404).json({ errors: [`campaign with id ${parsedId} not found`] });
        }

        if (current.excluido && parsedsoft) {
            return res.status(404).json({ errors: [`campaign with id ${parsedId} not found`] });
        }

        try {
            const deleted = await model.deleteCampaign(parsedId, parsedsoft);
            if( !parsedsoft) {
                deleted.excluido = true;
                deleted.dataExclusao = new Date();
            }
            res.status(200).json({ deleted })
        } catch(err) {
            console.error(err);
            res.status(500).json({ errors: ['something went wrong'] });
        }
    }
}

export default CampaignController;