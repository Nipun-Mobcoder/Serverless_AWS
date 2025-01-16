const { dbConnect } = require("./utils/db");
const { errorResponse, successResponse } = require("./utils/response");

module.exports.handler = async (event) => {
    const mongoClient = await dbConnect(process.env.MONGO_URL);
    const body = JSON.parse(event.body);

    const { username, password, email } = body;

    if (!username || !password || !email) {
        return errorResponse(400, 'Username and password are required.');
    }

    const db = mongoClient.db('test');
    const collection = db.collection('users');
    await collection.insertOne({ email, username, password });

    return successResponse(201, { message: 'User registered successfully.' });
}