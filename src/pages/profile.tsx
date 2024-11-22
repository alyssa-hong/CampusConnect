import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Header from '../components/Header/Header'; // Make sure to import Header component
import '../styles/Profile.css';

const ProfilePage: React.FC<{ setIsAuthorized: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setIsAuthorized }) => {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isEditable, setIsEditable] = useState({
    firstName: false,
    lastName: false,
    userName: false,
    password: false,
  });
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user?.email) {
      router.push('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const res = await fetch(`/api/getUser?email=${session.user.email}`);
        if (!res.ok) throw new Error('Failed to fetch user data.');
        const data = await res.json();
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          userName: data.userName || '',
          email: data.email || '',
          password: '', // Don't display password initially for security
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [session, status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Prepare data to be sent to the server
    const updatedUserData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      userName: formData.userName,
      email: formData.email,
      password: formData.password,  // Include password if it's being updated
    };
  
    try {
      const res = await fetch('/api/updateUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUserData),
      });
  
      if (res.ok) {
        const data = await res.json();
        console.log('User updated successfully:', data);
        // Optionally, you could add a success message to display to the user
      } else {
        const errorData = await res.json();
        console.error('Error updating user:', errorData.message);
        // Optionally, you could add an error message to display to the user
      }
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };
  

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleEditable = (field: string) => {
    setIsEditable((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const logout = () => {
    signOut(); // This will log the user out
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {/* Include Header with isAuthorized and logout functions */}
      <Header 
        setIsAuthorized={setIsAuthorized} 
        isAuthorized={!!session?.user} 
        logout={logout} 
      />
      
      <main className="profileSection">
        <div className="profileBox">
          <h2 className="title">Profile Details</h2>
          <form className="profileForm" onSubmit={handleSaveChanges}>
            <div className="formGroup">
              <label htmlFor="firstName">First Name</label>
              <div className="inputContainer">
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  disabled={!isEditable.firstName}
                />
                <button
                  type="button"
                  onClick={() => toggleEditable('firstName')}
                  className="editButton"
                >
                  {isEditable.firstName ? 'Done' : 'Edit'}
                </button>
              </div>
            </div>

            <div className="formGroup">
              <label htmlFor="lastName">Last Name</label>
              <div className="inputContainer">
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  disabled={!isEditable.lastName}
                />
                <button
                  type="button"
                  onClick={() => toggleEditable('lastName')}
                  className="editButton"
                >
                  {isEditable.lastName ? 'Done' : 'Edit'}
                </button>
              </div>
            </div>

            <div className="formGroup">
              <label htmlFor="userName">Username</label>
              <div className="inputContainer">
                <input
                  type="text"
                  id="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder="Enter username"
                  disabled={!isEditable.userName}
                />
                <button
                  type="button"
                  onClick={() => toggleEditable('userName')}
                  className="editButton"
                >
                  {isEditable.userName ? 'Done' : 'Edit'}
                </button>
              </div>
            </div>

            <div className="formGroup">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                disabled
              />
            </div>

            <div className="formGroup">
              <label htmlFor="password">Password</label>
              <div className="inputContainer">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  disabled={!isEditable.password}
                />
                <button
                  type="button"
                  className="showPasswordButton"
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? 'Hide' : 'Show'}
                </button>
                <button
                  type="button"
                  onClick={() => toggleEditable('password')}
                  className="editButton"
                >
                  {isEditable.password ? 'Done' : 'Edit'}
                </button>
              </div>
            </div>

            <button type="submit" className="saveButton">Save All Changes</button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
