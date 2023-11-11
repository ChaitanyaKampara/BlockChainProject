import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { ethers } from "ethers";

const Home = ({ blockChain, currentAccount }) => {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [purchasedPosts, setPurchasedPosts] = useState(new Set());

  useEffect(() => {
    async function fetchPosts() {
      if (!blockChain) return;

      try {
        setLoading(true);

        const postCount = await blockChain.getPostCount();
        const fetchedPosts = [];

        for (let i = 0; i < postCount; i++) {
          const [creator, index, title, description, likes, isPaid] =
            await blockChain.getPost(i);

          fetchedPosts.push({
            creator: creator.toLowerCase(),
            index: Number(index),
            title: title.toString(),
            description: description.toString(),
            likes: Number(likes),
            isPaid,
          });
        }

        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [blockChain]);

  const handlePurchase = async (index) => {
    try {

      const post = posts[index];
      const tipAmount = ethers.utils.parseEther("1.0");

      await blockChain.purchaseSubscription(post.creator, index, {
        value: tipAmount,
      });

      setPurchasedPosts(new Set(purchasedPosts).add(index));

      alert("Purchased successfully!");
    } catch (error) {
      console.error("Error purchasing the content:", error);
      alert("Error purchasing the content. Please try again.");
    }
  };

  const handleLike = async (index) => {
    try {
      const post = posts[index];
      const tipAmount = ethers.utils.parseEther("0.1");

      await blockChain.likeContent(index, {
        value: tipAmount,
      });

      const updatedPosts = [...posts];
      updatedPosts[index].likes = post.likes + 1;
      setPosts(updatedPosts);

      alert("Liked successfully!");
    } catch (error) {
      console.error("Error liking the content:", error);
      alert("Error liking the content. Please try again.");
    }
  };

  return (
    <div className="home-container">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {posts.length === 0 && <h1>No posts Yet, Create one!!</h1>}
          <h1 className="all-posts-heading">All Posts</h1>
          {posts.map((post, index) => (
            <Card key={index} className="post-card mt-3">
              <Card.Body>
                {post.creator === currentAccount ? (
                  <div className="creator-post">
                    <Card.Title>
                      <b>Creator</b>: {post.creator}
                    </Card.Title>
                    <Card.Text>
                      <b>Title</b>: {post.title}
                    </Card.Text>
                    <Card.Text>
                      <b>Description</b>: {post.description}
                    </Card.Text>
                    <div className="likes-count">
                      <b>Likes</b>: {post.likes}
                    </div>
                    <Button
                      variant="success"
                      onClick={() => handleLike(index)}
                      className="like-button"
                    >
                      Like
                    </Button>
                    <div className="your-own-post">Your own post</div>
                  </div>
                ) : (
                  <div className="non-creator-post">
                    <Card.Title>
                      <b>Creator</b>: {post.creator}
                    </Card.Title>
                    <Card.Text>
                      <b>Title</b>: {post.title}
                    </Card.Text>
                    {!post.isPaid && (
                      <div>
                        <Card.Text>
                          <b>Description</b>: {post.description}
                        </Card.Text>
                        <div className="likes-count">
                          <b>Likes</b>: {post.likes}
                        </div>
                        <Button
                          variant="success"
                          onClick={() => handleLike(index)}
                          className="like-button"
                        >
                          Like
                        </Button>
                      </div>
                    )}
                    {post.isPaid && purchasedPosts.has(index) ? (
                      <div>
                        <Card.Text>
                          <b>Description</b>: {post.description}
                        </Card.Text>
                        <div className="likes-count">
                          <b>Likes</b>: {post.likes}
                        </div>
                        <Button
                          variant="success"
                          onClick={() => handleLike(index)}
                          className="like-button"
                        >
                          Like
                        </Button>
                      </div>
                    ) : (
                      <div className="purchase-button">
                        {post.isPaid ? (
                          <Button
                            variant="primary"
                            onClick={() => handlePurchase(index)}
                            className="purchase-button"
                          >
                            Purchase
                          </Button>
                        ) : (
                          <p></p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;