import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '../components/Footer/Footer';
import '../styles/HomePage.css'; 

// Dummy event data with submitters name and contact info
const events = [
  {
    id: 1,
    title: 'React Workshop',
    date: '2024-11-10',
    time: '10:00 AM',
    description: 'Learn React from scratch!',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFi4_-9fNmkOc4nkBq6YLPG8higxuZsBuXGQ&s',
    submitterName: 'John Doe',
    contactInfo: 'johndoe@example.com',
  },
  {
    id: 2,
    title: 'JavaScript for Beginners',
    date: '2024-11-12',
    time: '2:00 PM',
    description: 'A hands-on session to improve your JS skills.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/1200px-Unofficial_JavaScript_logo_2.svg.png',
    submitterName: 'Jane Smith',
    contactInfo: 'janesmith@example.com',
  },
  {
    id: 3,
    title: 'Web Development Bootcamp',
    date: '2024-11-15',
    time: '9:00 AM',
    description: 'Intensive bootcamp covering web dev essentials.',
    image: 'https://www.hubspot.com/hubfs/web-development.webp',
    submitterName: 'Alex Johnson',
    contactInfo: 'alexjohnson@example.com',
  },
];

const HomePage: React.FC = () => {
  return (
    <div>
      <h1 className="event-header">All Events</h1>
      <p className="event-head">Here are all the events happening:</p>

      <div className="event-list">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <Image
              src={event.image}
              alt={event.title}
              width={250} 
              height={150} 
              className="event-image"
            />
            <h3>{event.title}</h3>
            <p>{event.date} at {event.time}</p>
            <p>{event.description}</p>
            <p><strong>Submitted by:</strong> {event.submitterName}</p>
            <p><strong>Contact:</strong> {event.contactInfo}</p>
          </div>
        ))}
      </div>

      <Link href="/add-event">
        <button className="add-event-button">Add Event</button>
      </Link>

      <div style={{ height: '2rem' }}></div>
      <Footer />
      
    </div>
  );
};

export default HomePage;
