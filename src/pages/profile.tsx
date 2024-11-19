import React, { useState } from 'react';
import { useRouter } from 'next/router';
import '../styles/Profile.css';

const ProfilePage: React.FC<{ setIsAuthorized: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setIsAuthorized }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const router = useRouter();

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
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    });
  };

  const handleLogout = () => {
    console.log('Logging out...');
    setIsAuthorized(false);
    router.push('/'); // Redirect to the unauthorized page
  };

  return (
    <main className="profileSection">
      <div className="profileBox">
        <h2 className="title">Profile Details</h2>
        <form className="profileForm" onSubmit={handleSaveChanges}>
          <label className="label" htmlFor="firstName">
            First Name
          </label>
          <input
            className="input"
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter first name"
          />

          <label className="label" htmlFor="lastName">
            Last Name
          </label>
          <input
            className="input"
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter last name"
          />

          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            className="input"
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
          />

          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            className="input"
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
          />

          <button className="saveButton" type="submit">
            Save Changes
          </button>
        </form>
      </div>
    </main>
  );
};

export default ProfilePage;
