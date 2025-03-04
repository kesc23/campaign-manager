export default function checkDataFimGTDataInicio(inicio: Date, fim: Date) {
    if( fim.getTime() > inicio.getTime() ) return true;
    return 'dataInicio cannot be greater than dataFim'
}