function select_tables_slots(hotel) {
  let tableavailable = [],
    slots = "";

  if (hotel && hotel.Available_Slots) {
    slots = hotel.Available_Slots;
    slots = slots.split(",").map((slt) => slt.trim());

    let c = 0;
    for (let slot of slots) {
      if (slot) {
        tableavailable.push(c + 1);
        let newslot = slot.split(";").map((slt) => slt.trim());

        slots[c] = newslot;
      }
      c++;
    }
  }

  let result = {
    hotel: hotel,
    slots: slots,
    tableavailable: tableavailable,
  };
  return result;
}

module.exports = select_tables_slots;
