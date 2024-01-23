"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lambdaHandler = void 0;
const lambdaHandler = async (event) => {
    const person = JSON.parse(event.body);
    return {
        statusCode: 200,
        body: JSON.stringify({ 'Person': person })
    };
};
exports.lambdaHandler = lambdaHandler;
//# sourceMappingURL=app.js.map