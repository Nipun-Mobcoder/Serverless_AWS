const { dbConnect } = require("./utils/db");
const { errorResponse, successResponse } = require("./utils/response");
const jwt = require('jsonwebtoken');

module.exports.handler = async (event) => {
    let mongoClient;
    try {
        mongoClient = await dbConnect(process.env.MONGO_URL);
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
    
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
    
        return successResponse(200, token);
    } catch (e) {
        console.error(error);
        return errorResponse(500, "Looks like something went wrong.");
    } finally {
        if (mongoClient) {
            await mongoClient.close();
        }
    }
}