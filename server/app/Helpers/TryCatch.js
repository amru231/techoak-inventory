const consoleLog = require("./consoleLog")

const TryCatch = async (res, callbak) => {

    try {

       await callbak()

    } catch (error) {
        
        consoleLog('try catch error', error)
        res.json({ok: false})
    }
}

module.exports = TryCatch