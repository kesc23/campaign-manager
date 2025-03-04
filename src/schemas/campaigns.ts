import z from "zod";

const dateOrNullSchema = z.preprocess(
    (val) => {
        if (val === null || val === undefined) return null;
        return new Date(val as string|Date);
    }, z.union([z.date(), z.null()])
);

export const CampaignSchema = z.object({
    id: z.number().optional(),
    nome: z.string(),
    dataCadastro: z.date().or(z.string()).pipe(z.coerce.date()).optional(),
    dataInicio: z.date().or(z.string()).pipe(z.coerce.date()),
    dataFim: z.date().or(z.string()).pipe(z.coerce.date()),
    status: z.enum(['ativa', 'pausada', 'expirada']).optional(),
    categoria: z.string(),
    dataExclusao: dateOrNullSchema,
    excluido: z.boolean().optional()
});

export const CampaignEditSchema = z.object({
    id: z.number().optional(),
    nome: z.string().optional(),
    dataCadastro: z.date().or(z.string()).pipe(z.coerce.date()).optional(),
    dataInicio: z.date().or(z.string()).pipe(z.coerce.date()).optional(),
    dataFim: z.date().or(z.string()).pipe(z.coerce.date()).optional(),
    status: z.enum(['ativa', 'pausada', 'expirada']).optional(),
    categoria: z.string().optional(),
    dataExclusao: dateOrNullSchema,
    excluido: z.boolean().optional()
});

export const CampaingIdSchema = z.coerce.number();