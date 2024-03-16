
const qs = require('qs')

const axios = require('axios');
const getAccessToken = async (refreshToken) => {
    try {
        let data = qs.stringify({
            'client_id': process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            'client_secret': process.env.GOOGLE_CLIENT_SECRET,
            'refresh_token': refreshToken,
            'grant_type': 'refresh_token'
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://oauth2.googleapis.com/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        };

        const response = await axios.request(config);
        const accessToken = response.data.access_token;
        console.log("Access token from fn is " + accessToken);
        return accessToken;
    } catch (error) {
        console.log(error);
        throw error; // Re-throw the error so it can be caught by the caller
    }
};

export default getAccessToken;