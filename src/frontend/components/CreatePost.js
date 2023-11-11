import React, { useState } from 'react';

const CreatePost = ({ blockChain }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [postCreated, setPostCreated] = useState(false);

  const handlePostContent = async () => {
    if (title.trim() === '' || description.trim() === '' || username.trim() === '') {
      alert('Title, description, and username cannot be empty');
      return;
    }

    try {
      setLoading(true);
      await blockChain.addContentAndCreator(username, title, description, isPaid);
      setLoading(false);
      setPostCreated(true);

    
      setTitle('');
      setDescription('');
      setUsername('');
      setIsPaid(false);
    } catch (error) {
      console.error('Error posting content:', error);
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create Post</h2>
      {postCreated ? (
        <div className="alert alert-success">Post created successfully!</div>
      ) : (
        <form className='form container'>
          <div className="form-group">
            <label>Username:</label>
            <input
              className="form-control"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Title:</label>
            <input
              className="form-control"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Is Paid:</label>
            <select
              className="form-control"
              value={isPaid}
              onChange={(e) => setIsPaid(e.target.value === 'true')}
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </div>
          <button
            className="btn btn-primary"
            type="button"
            onClick={handlePostContent}
            disabled={loading}
          >
            {loading ? 'Posting...' : 'Post Content'}
          </button>
        </form>
      )}
    </div>
  );
};

export default CreatePost;