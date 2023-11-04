const hooks = require('./promise-hooks')
const fetch = require('node-fetch2');

const COLOR = {
  RESET: "\x1b[0m",
  GREEN: "\x1b[32m",
  RED: "\x1b[31m",
};

const errMsg = (...args) => `${COLOR.RED}${args.join(" ")}${COLOR.RESET}`;
const succMsg = (...args) => `${COLOR.GREEN}${args.join(" ")}${COLOR.RESET}`;

hooks.enable()
async function asyncFn (){
    return  new Promise((resolve, reject) => {
    reject('Hi')
    })
}

async function nestedAsyncFn() {
  const val = await asyncFn();
  console.log(succMsg('nestedAsyncFn resolved'))
  return val;
}
async function init() {
  return await nestedAsyncFn();
}

// async function getPokemons() {
//   try {
//     const val = await fetch('https://pokeapi.co/api/v2/pokemon/ditto')

//     return val.json()
//   } catch (error) {
//     console.log(error)
//   }
// }

async function testFn() {
  try {
    const val = await init();
    console.log(succMsg("**************"))
    console.log(succMsg("Awaited value: ", val));
    console.log(succMsg("**************"))
  } catch (error) {
    console.log(errMsg("**************"))
    console.log(errMsg("Catched error:", error));
    console.log(errMsg("**************"))
  }
}

testFn()
