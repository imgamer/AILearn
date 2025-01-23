var process = process || {env: {NODE_ENV: "development"}};
class MicroPythonUtil {
  constructor() {
  }

  static resolveCommandOutput(cmd, outputArray) {
    const idx = outputArray.findIndex(item => item.indexOf(cmd) > 0)
    const newOutput = outputArray.slice(idx + 1).filter(line => line.trim() !== ">>>")
    console.log(newOutput)
    return newOutput.join('')
  } 
}
