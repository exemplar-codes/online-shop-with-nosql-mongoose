const extractKeys = (argObject, desiredKeysArr = ["id"], shortKeys = true) => {
  return Object.entries(argObject).reduce((accum, [k, v]) => {
    if (desiredKeysArr.includes(k)) {
      const key = shortKeys ? k.split(".").at(-1) : k;
      accum[key] = v;
    }

    return accum;
  }, {});
};

module.exports = { extractKeys };
