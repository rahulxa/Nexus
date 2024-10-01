import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom';

function Logout() {
    axios.defaults.withCredentials = true;

    const navigate = useNavigate();

    const logoutUser = async () => {
        const loggedOutUser = await axios.post("http://localhost:8080/api/v1/users/logout")
        localStorage.removeItem("username")
        navigate("/authentication");
        console.log("user logged out");
    }

    return (
        <div className='mt-64'>
            <p>njdhnskfnksdf</p>
            <button className='bg-gray-400'
                onClick={logoutUser}
            >Logout</button>
        </div>
    )
}

export default Logout