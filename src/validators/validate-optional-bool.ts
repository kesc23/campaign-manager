import z from "zod";

export default function validateOptionalBool(value: boolean | undefined | null) {
    const dateOrNullSchema = z.preprocess(
        (val) => {
            if (val === null || val === undefined) return null;
            if (val === 'true') return true;
            if (val === true) return true;
            return false;
        }, z.union([z.boolean(), z.null()])
    );
    const test = dateOrNullSchema.optional();
    return test.safeParse( value );
}