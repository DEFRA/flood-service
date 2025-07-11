// Ignore items in global scope added by the AWS SDK for JavaScript v3.
const globalsAsArray = [
  '__extends', '__assign', '__rest', '__decorate', '__param', '__esDecorate', 
  '__runInitializers', '__propKey', '__setFunctionName', '__metadata', 
  '__awaiter', '__generator', '__exportStar', '__createBinding', '__values', 
  '__read', '__spread', '__spreadArrays', '__spreadArray', '__await', 
  '__asyncGenerator', '__asyncDelegator', '__asyncValues', '__makeTemplateObject', 
  '__importStar', '__importDefault', '__classPrivateFieldGet', '__classPrivateFieldSet', 
  '__classPrivateFieldIn', '__addDisposableResource', '__disposeResources', 
  '__rewriteRelativeImportExtension'
]

const globals = globalsAsArray.toString()

module.exports = {
  globals
}
