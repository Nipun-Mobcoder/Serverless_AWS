const { dbConnect } = require("./utils/db");
const { errorResponse, successResponse } = require("./utils/response");

module.exports.handler = async (event) => {
    const mongoClient = await dbConnect(process.env.MONGO_URL);
    const body = JSON.parse(event.body);

    const { email, password } = body;

    if (!email || !password) {
        return errorResponse(400, 'Username and password are required.');
    }

    const db = mongoClient.db('test');
    const collection = db.collection('users');
    const user = await collection.findOne({ email });

    if (!user || password !== user.password) {
        return errorResponse(401, 'Invalid username or password.');
    }

    return successResponse(200, { "data": "Successful" });
}