const jwt = require('jsonwebtoken');

exports.handler = async (event) => {
  try {
    const token = extractToken(event);
    if (!token) {
      return generatePolicy('Deny', event.routeArn, 'Unauthorized');
    }

    const secretKey = process.env.JWT_SECRET;

    const decoded = jwt.verify(token, secretKey);
    return generatePolicy('Allow', event.routeArn, decoded.email, {
      userId: decoded.id,
      email: decoded.email,
    });
  } catch (error) {
    console.log('Authorization error:', error.message);
    return generatePolicy('Deny', event.routeArn, 'Unauthorized');
  }
};

const extractToken = (event) => {
  const authHeader = event.headers?.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};

const generatePolicy = (effect, resource, principalId, context) => {
  return {
    principalId: principalId || 'anonymous',
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
    context: context || {},
  };
};
