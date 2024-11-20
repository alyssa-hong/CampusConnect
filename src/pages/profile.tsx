import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import '../styles/Profile.css';

const ProfilePage: React.FC<{ setIsAuthorized: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setIsAuthorized }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Replace with logic to get the current user's email (e.g., from cookies, localStorage, or context)
    const email = 'user@example.com';  // Hardcoded for testing, replace with dynamic fetching logic

    const fetchUserData = async () => {
      try {
        const res = await fetch(`/api/getUser?email=${email}`);
        if (!res.ok) throw new Error('Failed to fetch user data.');

        const data = await res.json();
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          userName: data.userName || '',
          email: data.email || '',
          password: data.password || '',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <main className="profileSection">
      <div className="profileBox">
        <h2 className="title">Profile Details</h2>
        <form className="profileForm" onSubmit={handleSaveChanges}>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter first name"
          />

          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter last name"
          />

          <label htmlFor="userName">Username</label>
          <input
            type="text"
            id="userName"
            value={formData.userName}
            onChange={handleChange}
            placeholder="Enter username"
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
          />

          <button type="submit" className="saveButton">Save Changes</button>
        </form>
      </div>
    </main>
  );
};

export default ProfilePage;
