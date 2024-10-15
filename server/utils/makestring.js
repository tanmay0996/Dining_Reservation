function makestring(starttime, endtime, no_of_tables) {
  let Available_Slots = "";

  for (let k = 1; k <= no_of_tables; k++) {
    let i = parseInt(starttime) + 1,
      j = parseInt(endtime);
    let str = "";
    while (i <= j) {
      str += (i - 1).toString() + "-" + i.toString() + ";";
      i++;
    }
    str = str.slice(0, -1);
    str += ",";
    Available_Slots += str;
  }

  Available_Slots = Available_Slots.slice(0, -1);
  return Available_Slots;
}

module.exports = makestring;
