"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import "./ArticleDetail.css";

// --- TypeScript Interfaces ---
interface Reply {
  id: string;
  name: string;
  date: string;
  text: string;
  avatar: string;
}

interface Comment {
  id: string;
  name: string;
  date: string;
  text: string;
  avatar: string;
  replies: Reply[]; 
}

const defaultComments: Comment[] = [
  {
    id: "1",
    name: "Lincoln Gothane",
    date: "12 March 2026",
    text: "Great insights! The part about mobile checkout optimization really helped me understand where my store was leaking revenue.",
    avatar: "https://i.pravatar.cc/150?img=11",
    replies: [], 
  },
  {
    id: "2",
    name: "Emerald Saphirus",
    date: "10 March 2026",
    text: "I tried the sticky Add-to-cart button you suggested and saw an immediate 6% lift. Thank you!",
    avatar: "https://i.pravatar.cc/150?img=32",
    replies: [], 
  },
];

// --- MAIN LOGIC COMPONENT ---
function CommentsContent() {
  const searchParams = useSearchParams();
  
  // ✅ SECRET KEY LOGIC: URL me "?secret=ing_admin_789" hoga tabhi isAdmin true hoga
  const isAdmin = searchParams.get("secret") === "ing_admin_789";

  const [comments, setComments] = useState<Comment[]>(defaultComments);
  const [isLoaded, setIsLoaded] = useState(false); 

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyData, setReplyData] = useState({ name: "", email: "", message: "" });

  // --- LocalStorage Setup ---
  useEffect(() => {
    const savedComments = localStorage.getItem("blog_comments");
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
    setIsLoaded(true); 
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("blog_comments", JSON.stringify(comments));
    }
  }, [comments, isLoaded]);

  // --- Handlers ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "name") {
      const nameRegex = /^[a-zA-Z\s]*$/;
      if (!nameRegex.test(value)) return; 
    }
    if (name === "phone") {
      const phoneRegex = /^[\d\s+\-()]*$/;
      if (!phoneRegex.test(value)) return; 
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleReplyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "name") {
      const nameRegex = /^[a-zA-Z\s]*$/;
      if (!nameRegex.test(value)) return;
    }
    setReplyData({ ...replyData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim() || !formData.email.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      text: formData.message.trim(),
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
      replies: [], 
    };

    setComments([...comments, newComment]);
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const handleReplySubmit = (commentId: string) => {
    if (!replyData.name.trim() || !replyData.message.trim() || !replyData.email.trim()) return;

    const newReply: Reply = {
      id: Date.now().toString(),
      name: replyData.name.trim(),
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      text: replyData.message.trim(),
      avatar: `https://i.pravatar.cc/150?u=${Date.now() + 1}`,
    };

    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply]
        };
      }
      return comment;
    });

    setComments(updatedComments);
    setReplyingToId(null); 
    setReplyData({ name: "", email: "", message: "" }); 
  };

  const handleDeleteComment = (commentId: string) => {
    const filteredComments = comments.filter(comment => comment.id !== commentId);
    setComments(filteredComments);
  };

  const handleDeleteReply = (commentId: string, replyId: string) => {
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: comment.replies.filter(reply => reply.id !== replyId)
        };
      }
      return comment;
    });
    setComments(updatedComments);
  };

  if (!isLoaded) {
    return <div className="comments-section"><p>Loading comments...</p></div>;
  }

  return (
    <div className="comments-section">
      <h3 className="comments-heading">{comments.length} Comments</h3>

      {comments.map((comment) => (
        <div key={comment.id} className="comment-wrapper" style={{ marginBottom: "20px" }}>
          
          {/* MAIN COMMENT */}
          <div className="comment-item">
            <div className="comment-avatar">
              <img src={comment.avatar} alt="User" />
            </div>
            <div className="comment-body">
              <h4 className="comment-author">{comment.name}</h4>
              <span className="comment-date">{comment.date}</span>
              <p className="comment-text">{comment.text}</p>
              
              <div className="comment-actions" style={{ display: "flex", gap: "15px" }}>
                <button 
                  className="comment-reply-btn" 
                  onClick={() => {
                    setReplyingToId(replyingToId === comment.id ? null : comment.id);
                    setReplyData({ name: "", email: "", message: "" });
                  }}
                >
                  {replyingToId === comment.id ? "Cancel" : "Reply"}
                </button>

                {/* ✅ Delete Button: Sirf Admin ko dikhega */}
                {isAdmin && (
                  <button 
                    className="comment-delete-btn"
                    onClick={() => handleDeleteComment(comment.id)}
                    style={{ color: "#ff4d4d", background: "none", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "500" }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* REPLY FORM */}
          {replyingToId === comment.id && (
            <div className="reply-form" style={{ marginLeft: "60px", marginTop: "15px", marginBottom: "15px" }}>
              <input 
                type="text" 
                name="name"
                value={replyData.name} 
                onChange={handleReplyChange} 
                placeholder="Your Name" 
                className="comment-input" 
                style={{ marginBottom: "10px", padding: "10px", width: "100%", maxWidth: "300px", display: "block" }}
                required 
              />
              <input 
                type="email" 
                name="email"
                value={replyData.email} 
                onChange={handleReplyChange} 
                placeholder="Your Email" 
                className="comment-input" 
                style={{ marginBottom: "10px", padding: "10px", width: "100%", maxWidth: "300px", display: "block" }}
                required 
              />
              <textarea 
                name="message"
                value={replyData.message} 
                onChange={handleReplyChange} 
                placeholder="Write your reply..." 
                rows={2} 
                className="comment-textarea" 
                style={{ marginBottom: "10px", padding: "10px", width: "100%" }}
                required
              ></textarea>
              <button onClick={() => handleReplySubmit(comment.id)} className="comment-submit-btn">
                Post Reply
              </button>
            </div>
          )}

          {/* NESTED REPLIES DISPLAY */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="nested-replies" style={{ marginLeft: "60px", marginTop: "15px", borderLeft: "2px solid #444", paddingLeft: "20px" }}>
              {comment.replies.map((reply) => (
                <div key={reply.id} className="comment-item" style={{ marginBottom: "15px" }}>
                  <div className="comment-avatar">
                    <img src={reply.avatar} alt="User" style={{ width: "40px", height: "40px" }} />
                  </div>
                  <div className="comment-body">
                    <h4 className="comment-author">{reply.name}</h4>
                    <span className="comment-date">{reply.date}</span>
                    <p className="comment-text">{reply.text}</p>
                    
                    {/* ✅ Delete Button: Sirf Admin ko dikhega */}
                    {isAdmin && (
                      <button 
                        className="reply-delete-btn"
                        onClick={() => handleDeleteReply(comment.id, reply.id)}
                        style={{ color: "#ff4d4d", background: "none", border: "none", cursor: "pointer", fontSize: "12px", marginTop: "5px", padding: "0" }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      ))}

      {/* MAIN FORM */}
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
            type="tel" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange} 
            placeholder="Phone Number" 
            className="comment-input" 
            maxLength={20} 
            autoComplete="tel" 
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

// --- MAIN EXPORT WTIH SUSPENSE (Next.js requirement for useSearchParams) ---
export default function Comments() {
  return (
    <Suspense fallback={<div className="comments-section"><p>Loading comments...</p></div>}>
      <CommentsContent />
    </Suspense>
  );
}