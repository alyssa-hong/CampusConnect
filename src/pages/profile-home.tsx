import React, { useState } from 'react';
import '../styles/profilehome.css'; 

const ProfileHome: React.FC = () => {
  const username = 'Jenny'; // Replace with a dynamic username if available

  // Dummy data for the cards
  const [cards, setCards] = useState([
    { id: 1, content: 'Card 1 content' },
    { id: 2, content: 'Card 2 content' },
    { id: 3, content: 'Card 3 content' },
  ]);

  // Function to handle card deletion
  const handleDelete = (id: number) => {
    setCards(cards.filter(card => card.id !== id));
  };

  return (
    <div className="profile-home">
      <h1>Welcome, {username}</h1>

      <div className="card-box">
        {cards.map(card => (
          <div key={card.id} className="card">
            <p>{card.content}</p>
            <button className="delete-button" onClick={() => handleDelete(card.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileHome;

