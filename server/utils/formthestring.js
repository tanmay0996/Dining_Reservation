function formthestring(slots) {
  let newslot = "";
  for (let i of slots) {
    for (let j of i) {
      newslot += j;
      newslot += ";";
    }
    if (i !== "") {
      newslot = newslot.slice(0, -1);
    }
    newslot += ",";
  }

  return newslot;
}

module.exports = formthestring;
