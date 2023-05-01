const extractKeys = (
  argObject,
  desiredKeysArr = ["id"],
  { shortKeys = true, removeAssociatedColumns = true }
) => {
  return Object.entries(argObject).reduce((accum, [k, v]) => {
    if (!desiredKeysArr.includes(k)) return accum;
    if (removeAssociatedColumns && k.includes(".")) return accum;

    const key = shortKeys ? k.split(".").at(-1) : k;
    accum[key] = v;

    return accum;
  }, {});
};

const dateToTimeStampString = (dateString, haveAt = true) => {
  if (dateString) {
    const date = new Date(dateString);
    const options = {
      year: "2-digit",
      month: "short",
      day: "2-digit",
      hour: "numeric",
      minute: "numeric",
    };

    let dateList = new Intl.DateTimeFormat("en-IN", options)
      .format(date)
      .split("-");

    dateList = dateList.map((val) => {
      if (val.includes("am") || val.includes("pm")) return val.toUpperCase();
      return val;
    });

    if (haveAt) {
      return dateList.join(" ").split(",").join(" at");
    }
    return dateList.join(" ");
  }
  return "";
};

module.exports = { extractKeys, dateToTimeStampString };
