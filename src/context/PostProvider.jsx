import React, { createContext, useContext, useEffect, useReducer } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { UserContext } from "./UserProvider";
import Loader from "../components/Loader";
import { PostReducers, initialPostState } from "../reducers/PostReducers";

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [{ posts, loading }, dispatch] = useReducer(
    PostReducers,
    initialPostState
  );
  const { currentUser } = useContext(UserContext);

  const getAllPosts = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const snapshot = await getDocs(collection(db, "posts"));
      const allPosts = snapshot.docs
        .map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
        .sort((a, b) => b.createdAt - a.createdAt);

      dispatch({ type: "SET_POSTS", payload: allPosts });
    } catch (error) {
      console.error("Error getting posts:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const createPost = async ({ title, description, imageURL }) => {
    if (!currentUser) return;
    const newPost = {
      uid: currentUser.uid,
      username: currentUser.displayName || "Anonymous",
      photoURL: currentUser.photoURL || "",
      title,
      description,
      imageURL,
      createdAt: Timestamp.now(),
      likes: [],
      shares: [],
      comments: [],
    };

    try {
      const docRef = await addDoc(collection(db, "posts"), newPost);
      dispatch({ type: "ADD_POST", payload: { id: docRef.id, ...newPost } });
    } catch (error) {
      console.error("Error creating post:", error.message);
    }
  };

  const editPost = async (postId, newTitle, newDescription, newImageURL) => {
    try {
      const postRef = doc(db, "posts", postId);
      const data = {
        title: newTitle,
        description: newDescription,
        imageURL: newImageURL,
        updatedAt: Timestamp.now(),
      };
      await updateDoc(postRef, data);
      dispatch({ type: "UPDATE_POST", payload: { id: postId, data } });
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const deletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, "posts", postId));
      dispatch({ type: "DELETE_POST", payload: postId });
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const toggleLike = async (postId) => {
    const post = posts.find((p) => p.id === postId);
    const hasLiked = post.likes.includes(currentUser.uid);
    const updatedLikes = hasLiked
      ? post.likes.filter((id) => id !== currentUser.uid)
      : [...post.likes, currentUser.uid];

    try {
      await updateDoc(doc(db, "posts", postId), {
        likes: updatedLikes,
      });
      dispatch({
        type: "UPDATE_POST",
        payload: { id: postId, data: { likes: updatedLikes } },
      });
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const toggleShare = async (postId) => {
    const post = posts.find((p) => p.id === postId);
    const hasShared = post.shares.includes(currentUser.uid);
    const updatedShares = hasShared
      ? post.shares.filter((id) => id !== currentUser.uid)
      : [...post.shares, currentUser.uid];

    try {
      await updateDoc(doc(db, "posts", postId), {
        shares: updatedShares,
      });
      dispatch({
        type: "UPDATE_POST",
        payload: { id: postId, data: { shares: updatedShares } },
      });
    } catch (error) {
      console.error("Error toggling share:", error);
    }
  };

  const addComment = async (postId, text) => {
    const post = posts.find((p) => p.id === postId);
    const newComment = {
      uid: currentUser.uid,
      displayName: currentUser.displayName,
      photoURL: currentUser.photoURL || "",
      text,
      createdAt: Timestamp.now(),
    };
    const updatedComments = [...post.comments, newComment];

    try {
      await updateDoc(doc(db, "posts", postId), {
        comments: updatedComments,
      });
      dispatch({
        type: "UPDATE_POST",
        payload: { id: postId, data: { comments: updatedComments } },
      });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const deleteComment = async (postId, commentIndex) => {
    const post = posts.find((p) => p.id === postId);
    const comment = post?.comments?.[commentIndex];
    const isOwner = post?.uid === currentUser?.uid;
    const isCommentOwner = comment?.uid === currentUser?.uid;
    if (!comment || (!isOwner && !isCommentOwner)) return;

    const updatedComments = [...post.comments];
    updatedComments.splice(commentIndex, 1);

    try {
      await updateDoc(doc(db, "posts", postId), {
        comments: updatedComments,
      });
      dispatch({
        type: "UPDATE_POST",
        payload: { id: postId, data: { comments: updatedComments } },
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const getMyPosts = () =>
    posts.filter((post) => post.uid === currentUser?.uid);
  const getMyLikes = () =>
    posts.filter((post) => post.likes.includes(currentUser?.uid));
  const getMyShares = () =>
    posts.filter((post) => post.shares.includes(currentUser?.uid));

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <PostContext.Provider
      value={{
        posts,
        loadingPosts: loading,
        createPost,
        editPost,
        deletePost,
        toggleLike,
        toggleShare,
        addComment,
        deleteComment,
        getAllPosts,
        getMyPosts,
        getMyLikes,
        getMyShares,
      }}>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      ) : (
        children
      )}
    </PostContext.Provider>
  );
};
