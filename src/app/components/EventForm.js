"use client";

import { useState } from "react";
import { createEvent } from "../../lib/api.js";

export default function EventForm({ userId }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: "",
    location: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await createEvent({
        ...formData,
        created_by: userId,
      });
      if (response.message) {
        setMessage("Event created successfully!");
        setFormData({
          title: "",
          description: "",
          event_date: "",
          location: "",
        });
      } else {
        setMessage("Failed to create event.");
      }
    } catch (error) {
      setMessage("Error creating event.");
    }
  };

  return (
    <div className="event-form">
      <h2
        style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}
      >
        Create Event
      </h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Event Date</label>
          <input
            type="datetime-local"
            name="event_date"
            value={formData.event_date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Create Event</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
