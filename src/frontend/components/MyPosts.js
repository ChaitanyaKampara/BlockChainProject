import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";

const MyPosts = ({ blockChain, currentAccount }) => {
  const [loading, setLoading] = useState(false);
  const [myPosts, setMyPosts] = useState([]);
  console.log(currentAccount);

  useEffect(() => {
    async function fetchMyPosts() {
      if (!blockChain) return;

      try {
        setLoading(true);

        const postCount = await blockChain.getPostCount();
        const fetchedPosts = [];

        for (let i = 0; i < postCount; i++) {
          const [creator, index, title, description, likes, isPaid] =
            await blockChain.getPost(i);
            console.log(creator);
            if(creator.toLowerCase()===currentAccount){
              fetchedPosts.push({
                creator: creator.toLowerCase(),
                index: Number(index),
                title: title.toString(),
                description: description.toString(),
                likes: Number(likes),
                isPaid,
              });

            }

          
        }

        setMyPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching my posts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMyPosts();
  }, [blockChain, currentAccount]);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h1>My Posts</h1>
          {myPosts.length===0 && <h3>No posts yet create one !!</h3>}
          {myPosts.map((post, index) => (
            <Card key={index} style={{ marginBottom: "20px" }}>
              <Card.Body>
                    <Card.Title>
                      <b>Title</b>: {post.title}
                    </Card.Title>
                    <Card.Text>
                      <b>Description</b>: {post.description}
                    </Card.Text>
                    <div className="likes-count">
                      <b>Likes</b>: {post.likes}
                    </div>
                {post.isPaid ? <p>Content is paid</p> : <p>Content is free</p>}
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPosts;