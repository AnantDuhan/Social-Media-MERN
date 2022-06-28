import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import './CommentCard.css';
import { Delete } from '@mui/icons-material';

const CommentCard = ({userId,
  name,
  avatar,
  comment,
  commentId,
  postId,
  isAccount,}) => {
  return (
      <div className="commentUser">
          <Link to={`/user/${userId}`}>
              <img src={avatar} alt={name} />
              <Typography style={{ minWidth: '6vmax' }}>{name}</Typography>
          </Link>
          <Typography>{comment}</Typography>

          {isAccount ? (
              <Button onClick={deleteCommentHandle}>
                  <Delete />
              </Button>
          ) : userId === user._id ? (
              <Button onClick={deleteCommentHandle}>
                  <Delete />
              </Button>
          ) : null}
      </div>
  );
}

export default CommentCard