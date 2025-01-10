if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const jwt = require('jsonwebtoken');
const { 
    getProfile,
    updateProfile,
    updateLocation,
    deleteAccount
} = require('./userProcessor');

const verifyToken = (authHeader) => {
    if (!authHeader) {
        throw new Error('No token provided');
    }
    const token = authHeader.replace('Bearer ', '');
    return jwt.verify(token, process.env.JWT_SECRET);
};

exports.handler = async (event) => {
    try {
        // Verify JWT token
        const user = verifyToken(event.headers.Authorization);
        const { path, httpMethod, body } = event;
        const requestBody = body ? JSON.parse(body) : {};

        switch (`${httpMethod} ${path}`) {
            case 'GET /profile':
                return await getProfile(user.userId);

            case 'PUT /profile':
                return await updateProfile(user.userId, requestBody);

            case 'PUT /profile/location':
                return await updateLocation(user.userId, requestBody);

            case 'DELETE /profile':
                return await deleteAccount(user.userId, requestBody);

            default:
                return {
                    statusCode: 404,
                    body: JSON.stringify({ message: 'Not Found' })
                };
        }
    } catch (error) {
        console.error('Error:', error);
        if (error.message === 'No token provided' || error.name === 'JsonWebTokenError') {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Unauthorized' })
            };
        }
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' })
        };
    }
};