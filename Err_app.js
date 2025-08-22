class appError extends Error {
    constructor(massage, status) {
        super();
        this.message = massage;
        this.status = status;
    }
}
module.exports = appError;