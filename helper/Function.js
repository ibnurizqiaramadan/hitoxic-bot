class Function {
    parseJSON(json) {
        var data;
        try {
            data = JSON.parse(json)
        } catch (error) {
            data = {
                status: "fail",
                message: error
            }
        } finally {
            return data
        }
    }
}

module.exports = Function