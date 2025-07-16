import { useContext } from "react";
import Card from "../components/Card";
import CardSkeleton from "../components/CardSkeleton";
import { UserContext } from "../context/UserProvider";
import { PostContext } from "../context/PostProvider";
import Layout from "../components/Layout";

export const MyShares = () => {
  const { isAuthenticated } = useContext(UserContext);
  const { getMyShares, loadingPosts } = useContext(PostContext);

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">
            You must be logged in to view shared posts.
          </p>
        </div>
      </Layout>
    );
  }

  const sharedPosts = getMyShares();

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-10">
        <h1 className="text-3xl font-bold text-blue-500">Posts I Shared</h1>

        {loadingPosts ? (
          <CardSkeleton />
        ) : sharedPosts?.length > 0 ? (
          sharedPosts.map((post) => <Card key={post.id} post={post} />)
        ) : (
          <p className="text-gray-500 text-center">
            You haven't shared any posts yet.
          </p>
        )}
      </div>
    </Layout>
  );
};
