const { MongoClient } = require('mongodb');
const { errorResponse, successResponse } = require('./utils/response');

const client = new MongoClient(process.env.MONGO_URL);

exports.handler = async (event) => {
  try {
    const email = event.requestContext.authorizer.jwt.claims.email;
    if (!email) {
      return errorResponse(401, 'Unauthorized');
    }

    await client.connect();
    const db = client.db('test');
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ email });

    if (!user) {
      return errorResponse(404, 'User not found');
    }

    return successResponse(200, JSON.stringify({
      userName: user.userName,
      email: user.email,
      isAdmin: user.isAdmin,
      role: user.role,
    }));
  } catch (error) {
    console.error('Error fetching profile:', error);
    return errorResponse(500, 'Internal Server Error'); 
  }
};
