import checkDataFimGTDataInicio from '../../../dist/src/validators/datafim-gt-datainicio';
import checkDataInicioGTENow from '../../../dist/src/validators/datainicio-gte-now';

it("should fail as dataInicio > dataFim", () => {
    const result = checkDataFimGTDataInicio(new Date('2025-04-12'), new Date('2025-03-03'));
    expect(result).not.toEqual(true);
});

it("should fail as dataInicio < now", () => {
    const result = checkDataInicioGTENow(new Date('2025-02-12'));
    expect(result).not.toEqual(true);
});

it("should succed as dataInicio > now", () => {
    const date = new Date();
    date.setFullYear( date.getFullYear() + 1 );
    const result = checkDataInicioGTENow(date);
    expect(result).toEqual(true);
});