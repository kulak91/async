const hooks = require('./promise-hooks')
const fetch = require('node-fetch2');

const COLOR = {
  RESET: "\x1b[0m",
  GREEN: "\x1b[32m",
  RED: "\x1b[31m",
};
const a = 'a';

const errMsg = (...args) => `${COLOR.RED}${args.join(" ")}${COLOR.RESET}`;
const succMsg = (...args) => `${COLOR.GREEN}${args.join(" ")}${COLOR.RESET}`;

hooks.enable();
const b = 'a';

function asyncFn (){
    return  new Promise((resolve, reject) => {
      resolve('Hello from A');
    })
}

async function wrappedAsyncFn() {
  const val = await asyncFn();
  console.log(succMsg('in wrappedAsyncFn resolved'));
  return val;
}

async function getPokemons() {
  try {
    const val = await fetch('https://pokeapi.co/api/v2/pokemon/ditto')

    return val.json()
  } catch (error) {
    console.log(error)
  }
}

async function awaited() {
  return await wrappedAsyncFn();
}

function passThroughAsyncFn() {
  return wrappedAsyncFn();
}

async function init() {
  try {
    console.log('Launch awaited');
    const val = await awaited();
    console.log(succMsg("**************"))
    console.log(succMsg("Awaited value: ", val));
    console.log(succMsg("**************"))
  } catch (error) {
    console.log(errMsg("**************"))
    console.log(errMsg("Catched awaited error:", error));
    console.log(errMsg("**************"))
  }

  try {
    console.log('Launch not awaited');
    const val = await passThroughAsyncFn();
    console.log(succMsg("**************"))
    console.log(succMsg("Without await async value: ", val));
    console.log(succMsg("**************"))
  } catch (error) {
    console.log(errMsg("**************"))
    console.log(errMsg("Catched passed though error:", error));
    console.log(errMsg("**************"))
  }
}

init()
