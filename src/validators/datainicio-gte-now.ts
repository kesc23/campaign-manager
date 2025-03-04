export default function checkDataInicioGTENow(inicio: Date) {
    if( inicio.getTime() >= new Date().getTime() ) return true;
    return 'dataInicio must be greater than or equals now'
}