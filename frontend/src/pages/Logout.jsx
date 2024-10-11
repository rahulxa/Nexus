import axios from 'axios'
import httpStatus from 'http-status';
import React from 'react'
import { useNavigate } from 'react-router-dom';

function Logout() {
    axios.defaults.withCredentials = true;

    const navigate = useNavigate();

    const logoutUser = async () => {
        try {
            const response = await axios.post("http://localhost:8080/api/v1/users/logout")
            if (response.status === httpStatus.OK) {
                localStorage.removeItem("username")
                navigate("/authentication");
                console.log("user logged out");
            }
        } catch (error) {
            console.error("Error logging out:", error);
        }
    }

    return (
        <div className='mt-64'>
            <button className='bg-gray-400'
                onClick={logoutUser}
            >Logout</button>
        </div>
    )
}

export default Logout