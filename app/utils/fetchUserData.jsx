import axios from "axios";
export default async function fetchUserData( token, userId) {
    console.log(` ${token} ${userId}`)
    try {
        if (!token) {
            throw new Error("No authentication token found");
        }
        const response = await axios.get(`https://g32.iamdeveloper.in/api/users/listing/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        // console.log("data when function", response.data)
        return response.data;
    }
    catch (error) {
        console.error("Error while fetching userData:", error);
        return null;
    }
}