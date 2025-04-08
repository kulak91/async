const hooks = require('async_hooks')
const fs = require('fs')

let indent = 0

console.log('Test');

module.exports = hooks.createHook({
  promiseResolve (asyncId) {
    const indentStr = ' '.repeat(indent)
    fs.writeSync(1, `${indentStr}promise resolved: ${asyncId}\n`)
  },
  init (asyncId, type, triggerAsyncId, resource) {
    const eid = hooks.executionAsyncId()
    const indentStr = ' '.repeat(indent);
    fs.writeSync(1, `${indentStr}Init: ${type}(${asyncId}), trigger: ${triggerAsyncId}, resource: ${resource}, execution: ${eid}\n`)
  },
  before (asyncId) {
    const indentStr = ' '.repeat(indent)
    fs.writeSync(1, `${indentStr}before:  ${asyncId}\n`)
    indent += 2
  },
  after (asyncId) {
    indent -= 2
    const indentStr = ' '.repeat(indent)
    fs.writeSync(1, `${indentStr}after:   ${asyncId}\n`)
  },
  destroy (asyncId) {
    const indentStr = ' '.repeat(indent)
    fs.writeSync(1, `${indentStr}destroy: ${asyncId}\n`)
  }
})
