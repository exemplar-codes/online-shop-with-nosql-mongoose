function arraySorted(arr = []) {
  let prev = -Infinity;
  for (let current of arr) {
    if (prev > current) return false;
    prev = current;
  }
  return true;
}

const baseArray = Array(100)
  .fill(null)
  .map((i, idx) => idx);

// sync
// const hopefullySortedArray = baseArray.map((i, idx) => idx);
// console.log(arraySorted(hopefullySortedArray));

// async

const wait = async (arg) => {
  console.log(arg, Date.now());
  return await new Promise((r) => setTimeout(r, 1000));
};

// wait();
// wait(() => console.log(2));
// wait(() => console.log(3));

// let for_ = [];
// for (let i = 0; i < baseArray.length; i++) {
//   wait(i);
// }
// let forOf_ = [];
// let forEach_ = [];
// let map_ = [];

baseArray.map(async (i) => {
  //   await wait(i);
  console.log(i, Date.now());
  await new Promise((r) => setTimeout(r, 1000));
});
