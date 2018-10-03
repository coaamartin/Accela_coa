function formatToMMDDYYYY(date) {
    var yyyy = date.getFullYear().toString(),
        mm = (date.getMonth() + 1).toString(),
        dd = date.getDate().toString();

    // CONVERT mm AND dd INTO chars
    var mmChars = mm.split(''),
        ddChars = dd.split('');

    // CONCAT THE STRINGS IN YYYY-MM-DD FORMAT
    return datestring = (mmChars[1] ? mm : "0" + mmChars[0]) + '/' + (ddChars[1] ? dd : "0" + ddChars[0]) + '/' + yyyy;
}