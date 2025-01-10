const {
    getUserProfile,
    updateUserProfile,
    updateUserLocation,
    deleteUserAccount
} = require('./database');

const getProfile = async (userId) => {
    try {
        const profile = await getUserProfile(userId);
        if (!profile) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'User not found' })
            };
        }

        // Remove sensitive information
        delete profile.password_hash;
        
        return {
            statusCode: 200,
            body: JSON.stringify(profile)
        };
    } catch (error) {
        console.error('Error getting user profile:', error);
        throw error;
    }
};

const updateProfile = async (userId, profileData) => {
    try {
        await updateUserProfile(userId, profileData);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Profile updated successfully'
            })
        };
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};

const updateLocation = async (userId, locationData) => {
    try {
        await updateUserLocation(userId, locationData);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Location updated successfully'
            })
        };
    } catch (error) {
        console.error('Error updating location:', error);
        throw error;
    }
};

const deleteAccount = async (userId) => {
    try {
        await deleteUserAccount(userId);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Account deactivated successfully'
            })
        };
    } catch (error) {
        console.error('Error deleting account:', error);
        throw error;
    }
};

module.exports = {
    getProfile,
    updateProfile,
    updateLocation,
    deleteAccount
};