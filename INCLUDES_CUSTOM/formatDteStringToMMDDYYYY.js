/* formatDteStringToMMDDYYYY()
 * takes a string date in the format MM/DD/YYYY
 * it returns a 10 characters long date string if stringDte is not 10 characters long
 * e.g. stringDte == '7/24/2018' it returns '07/24/2018'
 */
function formatDteStringToMMDDYYYY(stringDte){
    var date = new Date(stringDte);
    
    var yyyy = date.getFullYear().toString(),
        mm = (date.getMonth() + 1).toString(),
        dd = date.getDate().toString();

    // CONVERT mm AND dd INTO chars
    var mmChars = mm.split(''),
        ddChars = dd.split('');

    // CONCAT THE STRINGS IN YYYY-MM-DD FORMAT
    return datestring = (mmChars[1] ? mm : "0" + mmChars[0]) + '/' + (ddChars[1] ? dd : "0" + ddChars[0]) + '/' + yyyy;
}