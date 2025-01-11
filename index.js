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

const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://weather-app.brad.launchdarklydemos.com',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key',
    'Access-Control-Allow-Methods': 'GET,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Credentials': true
};

const verifyToken = (authHeader) => {
    if (!authHeader) {
        throw new Error('No token provided');
    }
    const token = authHeader.replace('Bearer ', '');
    return jwt.verify(token, process.env.JWT_SECRET);
};

exports.handler = async (event) => {
    // Handle OPTIONS requests for CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: ''
        };
    }

    try {
        // Verify JWT token
        const user = verifyToken(event.headers.Authorization);
        const { path, httpMethod, body } = event;
        const requestBody = body ? JSON.parse(body) : {};

        let response;
        switch (`${httpMethod} ${path}`) {
            case 'GET /profile':
                response = await getProfile(user.userId);
                break;

            case 'PUT /profile':
                response = await updateProfile(user.userId, requestBody);
                break;

            case 'PUT /profile/location':
                response = await updateLocation(user.userId, requestBody);
                break;

            case 'DELETE /profile':
                response = await deleteAccount(user.userId, requestBody);
                break;

            default:
                response = {
                    statusCode: 404,
                    body: JSON.stringify({ message: 'Not Found' })
                };
        }

        // Add CORS headers to the successful response
        return {
            ...response,
            headers: {
                ...corsHeaders,
                ...(response.headers || {}) // Preserve any existing headers
            }
        };

    } catch (error) {
        console.error('Error:', error);
        const errorResponse = {
            statusCode: error.message === 'No token provided' || error.name === 'JsonWebTokenError' 
                ? 401 
                : 500,
            body: JSON.stringify({ 
                message: error.message === 'No token provided' || error.name === 'JsonWebTokenError'
                    ? 'Unauthorized'
                    : 'Internal server error'
            }),
            headers: corsHeaders
        };
        return errorResponse;
    }
};