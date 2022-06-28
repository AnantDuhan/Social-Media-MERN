import React from 'react';
import './Home.css';
import User from '../User/User'
import { Typography } from '@mui/material';
import Post from '../Post/Post';

const Home = () => {
  return (
      <div className="home">
          <div className="homeLeft">
              <Post
                  key={post._id}
                  postId={post._id}
                  caption={post.caption}
                  postImage={post.image.url}
                  likes={post.likes}
                  comments={post.comments}
                  ownerImage={post.owner.avatar.url}
                  ownerName={post.owner.name}
                  ownerId={post.owner._id}
              />
          </div>
          <div className="homeRight">
              {/* {users && users.length > 0 ? (
                  users.map((user) => ( */}
              <User
                  key={'user._id'}
                  userId={'user._id'}
                  name={'user.name'}
                  avatar={
                      'https://avatars.githubusercontent.com/u/50514029?v=4'
                  }
              />
              {/* ))
              ) : (
                  <Typography>No Users Yet</Typography>
              )} */}
          </div>
      </div>
  );
}

export default Home;