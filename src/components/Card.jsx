import React, { useContext, useState } from "react";
import { PostContext } from "../context/PostProvider";
import { UserContext } from "../context/UserProvider";
import EllipsesHorizontalIcon from "../icons/EllipsesHorizontalIcon";
import ProfileIcon from "../icons/ProfileIcon";
import LikeIcon from "../icons/LikeIcon";
import ShareIcon from "../icons/ShareIcon";
import CommentIcon from "../icons/CommentIcon";

export default function Card({ post }) {
  const { currentUser } = useContext(UserContext);
  const {
    deletePost,
    toggleLike,
    toggleShare,
    addComment,
    deleteComment,
    editPost,
  } = useContext(PostContext);

  const [showOptions, setShowOptions] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedDescription, setEditedDescription] = useState(post.description);
  const [editedImageURL, setEditedImageURL] = useState(post.imageURL);

  const isOwner = currentUser?.uid === post.uid;

  const handleEdit = () => {
    editPost(post.id, editedTitle, editedDescription, editedImageURL);
    setIsEditing(false);
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      addComment(post.id, commentText);
      setCommentText("");
      setShowCommentInput(false);
    }
  };

  return (
    <div className="bg-blue-500 text-white rounded-xl shadow-lg p-4 max-w-2xl mx-auto mb-6 border border-blue-700 relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {post.photoURL ? (
            <img
              src={post.photoURL}
              alt="User"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center">
              <ProfileIcon />
            </div>
          )}
          <div>
            <h2 className="font-medium text-sm">
              {post.username || "Anonymous"}
            </h2>
            <p className="text-xs text-white/70">
              {post.createdAt?.toDate?.().toLocaleString?.() || "Unknown date"}
            </p>
          </div>
        </div>
        {isOwner && (
          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="text-white hover:bg-blue-600 p-1 rounded-full">
              <EllipsesHorizontalIcon />
            </button>
            {showOptions && (
              <div className="absolute right-0 mt-2 bg-white text-gray-800 rounded shadow-md z-50 w-28">
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100">
                  Edit Post
                </button>
                <button
                  onClick={() => deletePost(post.id)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">
                  Delete Post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            className="input input-bordered w-full text-black"
            placeholder="Title"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <textarea
            className="w-full rounded-md p-2 text-black bg-gray-50"
            rows="3"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
          />
          <input
            type="text"
            className="input input-bordered w-full text-black"
            placeholder="Image URL"
            value={editedImageURL}
            onChange={(e) => setEditedImageURL(e.target.value)}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="btn btn-sm bg-gray-300 text-black">
              Cancel
            </button>
            <button
              onClick={handleEdit}
              className="btn btn-sm bg-green-500 text-white">
              Save
            </button>
          </div>
        </div>
      ) : (
        <>
          <h3 className="text-lg font-bold mb-2">{post.title}</h3>
          <p className="text-sm mb-3">{post.description}</p>
          {post.imageURL && (
            <div className="w-full h-full bg-blue-700 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
              <img
                src={post.imageURL}
                alt="post"
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
          )}
        </>
      )}

      <div className="flex justify-around border-t border-blue-300 pt-2 text-sm text-white">
        <button
          onClick={() => toggleLike(post.id)}
          className="bg-white text-blue-500 px-3 py-1 rounded-full hover:bg-blue-100 transition flex items-center gap-2">
          <LikeIcon /> {post.likes?.length || 0}
        </button>
        <button
          onClick={() => toggleShare(post.id)}
          className="bg-white text-blue-500 px-3 py-1 rounded-full hover:bg-blue-100 transition flex items-center gap-2">
          <ShareIcon /> {post.shares?.length || 0}
        </button>
        <button
          onClick={() => setShowCommentInput(!showCommentInput)}
          className="bg-white text-blue-500 px-3 py-1 rounded-full hover:bg-blue-100 transition flex items-center gap-2">
          <CommentIcon /> {post.comments?.length || 0}
        </button>
      </div>

      {showCommentInput && (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            className="input input-bordered flex-1 text-black"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button
            onClick={handleAddComment}
            className="btn bg-blue-700 text-white">
            Post
          </button>
        </div>
      )}

      {post.comments?.length > 0 && (
        <div className="mt-4 space-y-3">
          {post.comments.map((comment, index) => {
            const canDelete =
              currentUser?.uid === comment.uid || currentUser?.uid === post.uid;
            return (
              <div
                key={index}
                className="flex items-start gap-3 bg-white/10 p-3 rounded-md relative">
                {comment.photoURL ? (
                  <img
                    src={comment.photoURL}
                    alt="User"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
                    <ProfileIcon />
                  </div>
                )}
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    {comment.displayName || "Anonymous"}
                  </div>
                  <div className="text-xs text-white/70">
                    {comment.createdAt?.toDate?.().toLocaleString?.() ||
                      "Unknown date"}
                  </div>
                  <div className="text-sm mt-1">{comment.text}</div>
                </div>
                {canDelete && (
                  <button
                    onClick={() => deleteComment(post.id, index)}
                    className="text-xs text-red-300 hover:text-red-500 absolute top-1 right-2"
                    title="Delete comment">
                    ✕
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
