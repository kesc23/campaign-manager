/**
 * @param {string} item 
 * @returns 
 */
export default function isStringParseableToInt(item: string) {
    try {
        const value = parseInt(item);
        if (Number.isNaN(value)) throw new Error("not parseable");
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}