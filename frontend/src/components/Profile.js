import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import noDataSvg from '../assets/Bear/no-data.8ae2a50.svg';
import './Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5001/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error(error);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-image-container">
          <img
            src={noDataSvg}
            alt="Profile Visual"
            className="profile-image"
          />
        </div>
        <div className="profile-text">
          <h1 className="login-header">
            YOU HAVE SUCCESSFULLY <span className="green-text">LOGGED IN!</span>
          </h1>
          {userData && (
            <h2>
              Your username: <span className="green-text">{userData.username}</span>
            </h2>
          )}
          <button className="logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;