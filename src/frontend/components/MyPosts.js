import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";

const MyPosts = ({ blockChain, currentAccount }) => {
  const [loading, setLoading] = useState(false);
  const [myPosts, setMyPosts] = useState([]);
  console.log(currentAccount);

  useEffect(() => {
    async function fetchMyPosts() {
      if (!blockChain || !currentAccount) return;

      try {
        setLoading(true);

        const creatorContentList = await blockChain.getCreatorContent(
          currentAccount
        );

        const fetchedPosts = [];

        for (let i = 0; i < creatorContentList.length; i++) {
          const contentIndex = creatorContentList[i];
          const [creator, index, title, description, likes, isPaid] =
            await blockChain.getPost(contentIndex);
          fetchedPosts.push({
            creator,
            index: Number(index),
            title: title,
            description: description,
            likes: Number(likes),
            isPaid,
          });
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