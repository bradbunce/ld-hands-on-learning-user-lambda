const { queries } = require('./queries');

const dbConfig = {
    primary: {
        host: process.env.DB_PRIMARY_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    replica: {
        host: process.env.DB_READ_REPLICA_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
};

const createConnection = async (operation = 'read') => {
    const config = operation === 'read' ? dbConfig.replica : dbConfig.primary;
    return await mysql.createConnection(config);
};

const getUserProfile = async (userId) => {
    const connection = await createConnection('read');
    try {
        const [rows] = await connection.execute(queries.getUserProfile, [userId]);
        return rows[0];
    } finally {
        await connection.end();
    }
};

const updateUserProfile = async (userId, profileData) => {
    const connection = await createConnection('write');
    try {
        await connection.execute(
            queries.updateUserProfile,
            [
                profileData.email,
                profileData.city,
                profileData.state,
                profileData.countryCode,
                userId
            ]
        );
    } finally {
        await connection.end();
    }
};

const updateUserLocation = async (userId, locationData) => {
    const connection = await createConnection('write');
    try {
        await connection.execute(
            queries.updateUserLocation,
            [
                locationData.city,
                locationData.state,
                locationData.countryCode,
                locationData.latitude,
                locationData.longitude,
                userId
            ]
        );
    } finally {
        await connection.end();
    }
};

const deleteUserAccount = async (userId) => {
    const connection = await createConnection('write');
    try {
        await connection.execute(queries.deleteUser, [userId]);
    } finally {
        await connection.end();
    }
};

module.exports = {
    createConnection,
    getUserProfile,
    updateUserProfile,
    updateUserLocation,
    deleteUserAccount
};