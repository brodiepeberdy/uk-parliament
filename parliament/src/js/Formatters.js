class Formatters {
  static dateHandler(text) {
    // A null input means there isn't a date, i.e. the "present".
    if (text === null){
      return "Present";
    }
    const months = [ "January", "February", "March", "April", "May", "June",
           "July", "August", "September", "October", "November", "December" ];
    var year = text.substring(0,4);
    var month = months[parseInt(text.substring(5,7)) - 1];
    var ordInd = "th";
    if (text.substring(8,10) === "01" || text.substring(8,10) === "21" || text.substring(8,10) === "31"){
      ordInd = "st";
    }
    else if (text.substring(8,10)[1] === "02" || text.substring(8,10)[1] === "22") {
      ordInd = "nd";
    }
    else if (text.substring(8,10)[1] === "03" || text.substring(8,10)[1] === "23") {
      ordInd = "rd";
    }
    var day = parseInt(text.substring(8,10));
    return day + ordInd + " " + month + " " + year;
  }
}

export default Formatters;
