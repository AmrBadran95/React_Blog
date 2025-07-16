import { useContext } from "react";
import Card from "../components/Card";
import CardSkeleton from "../components/CardSkeleton";
import { UserContext } from "../context/UserProvider";
import { PostContext } from "../context/PostProvider";
import Layout from "../components/Layout";

export default function MyLikes() {
  const { isAuthenticated } = useContext(UserContext);
  const { getMyLikes, loadingPosts } = useContext(PostContext);

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">
            You must be logged in to view liked posts.
          </p>
        </div>
      </Layout>
    );
  }

  const likedPosts = getMyLikes();

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-10">
        <h1 className="text-3xl font-bold text-blue-500">Posts I Liked</h1>

        {loadingPosts ? (
          <CardSkeleton />
        ) : likedPosts?.length > 0 ? (
          likedPosts.map((post) => <Card key={post.id} post={post} />)
        ) : (
          <p className="text-gray-500 text-center">
            You haven't liked any posts yet.
          </p>
        )}
      </div>
    </Layout>
  );
}
