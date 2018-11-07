module.exports = {
  sleep: function(milliseconds){
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  },

  hello: function(args){
    if(args[0] == "1"){
      return "erste antwort";
    } else if(args[0] == "2") {
      return "zweite antwort";
    } else {
      return "keine antwort";
    }
  },

  timestamp: function(){
    var d = new Date();
    return d.getDate()+"-"+d.getMonth()+"-"+d.getFullYear()+"--"+d.getHours()+"-"+d.getMinutes();
  },

  /* Timestamp formated for console output */
  t: function(){
    var d = new Date();
    return d.getDate()+"."+(d.getMonth()+1)+"."+d.getFullYear()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+" ";
  }
}
