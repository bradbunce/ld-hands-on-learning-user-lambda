const queries = {
    getUserProfile: `
        SELECT 
            user_id,
            username,
            email,
            city,
            state,
            country_code,
            latitude,
            longitude,
            created_at,
            last_login,
            is_active
        FROM users 
        WHERE user_id = ?
    `,

    updateUserProfile: `
        UPDATE users 
        SET 
            email = ?,
            city = ?,
            state = ?,
            country_code = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
    `,

    updateUserLocation: `
        UPDATE users 
        SET 
            city = ?,
            state = ?,
            country_code = ?,
            latitude = ?,
            longitude = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
    `,

    deleteUser: `
        UPDATE users 
        SET 
            is_active = FALSE,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
    `
};

module.exports = { queries };