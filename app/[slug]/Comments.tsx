"use client";

import React, { useState } from "react";
import "./ArticleDetail.css";

export default function Comments() {
  const [comments, setComments] = useState([
    {
      id: "1",
      name: "Lincoln Gothane",
      date: "12 March 2026",
      text: "Great insights! The part about mobile checkout optimization really helped me understand where my store was leaking revenue.",
      avatar: "https://i.pravatar.cc/150?img=11",
    },
    {
      id: "2",
      name: "Emerald Saphirus",
      date: "10 March 2026",
      text: "I tried the sticky Add-to-cart button you suggested and saw an immediate 6% lift. Thank you!",
      avatar: "https://i.pravatar.cc/150?img=32",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // VALIDATION 1: Name field mein sirf letters aur spaces allow karna
    if (name === "name") {
      const nameRegex = /^[a-zA-Z\s]*$/;
      if (!nameRegex.test(value)) {
        return; // Agar number ya special character type kiya, toh yahi ruk jayega
      }
    }

    // VALIDATION 2: Phone field mein sirf numbers allow karna
    if (name === "phone") {
      const phoneRegex = /^[0-9]*$/;
      if (!phoneRegex.test(value)) {
        return; // Agar letter ya special character type kiya, toh yahi ruk jayega
      }
    }

    // Agar sab theek hai toh state update kar do
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Agar name ya message khali hai toh submit mat karo
    if (!formData.name.trim() || !formData.message.trim()) return;

    const newComment = {
      id: Date.now().toString(),
      name: formData.name.trim(), // Extra spaces hata denge
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      text: formData.message.trim(),
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
    };

    setComments([...comments, newComment]);

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="comments-section">
      <h3 className="comments-heading">{comments.length} Comments</h3>

      {comments.map((comment) => (
        <div key={comment.id} className="comment-item">
          <div className="comment-avatar">
            <img src={comment.avatar} alt="User" />
          </div>
          <div className="comment-body">
            <h4 className="comment-author">{comment.name}</h4>
            <span className="comment-date">{comment.date}</span>
            <p className="comment-text">{comment.text}</p>
            <button className="comment-reply-btn">Reply</button>
          </div>
        </div>
      ))}

      <div className="comment-form-wrapper">
        <h3 className="comments-heading">Leave Your Comment</h3>
        
        <form className="comment-form" onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="Name" 
            className="comment-input" 
            required 
          />
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="Email" 
            className="comment-input" 
            required 
          />
          <input 
            type="text" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange} 
            placeholder="Phone Number (Digits only)" 
            className="comment-input" 
            maxLength={15} // Phone number ki length limit bhi laga di hai
          />
          <input 
            type="text" 
            name="subject" 
            value={formData.subject} 
            onChange={handleChange} 
            placeholder="Subject" 
            className="comment-input" 
          />
          <textarea 
            name="message" 
            value={formData.message} 
            onChange={handleChange} 
            placeholder="Write your message here..." 
            rows={4} 
            className="comment-textarea" 
            required
          ></textarea>
          
          <button type="submit" className="comment-submit-btn">Send Message</button>
        </form>
      </div>
    </div>
  );
}