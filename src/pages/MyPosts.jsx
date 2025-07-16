import { useContext } from "react";
import Card from "../components/Card";
import CardSkeleton from "../components/CardSkeleton";
import { PostForm } from "../components/PostForm";
import { UserContext } from "../context/UserProvider";
import { PostContext } from "../context/PostProvider";
import Layout from "../components/Layout";

export default function MyPosts() {
  const { isAuthenticated } = useContext(UserContext);
  const { getMyPosts, loadingPosts } = useContext(PostContext);
  const myPosts = getMyPosts();

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-10">
        <h1 className="text-3xl font-bold text-blue-500">My Posts</h1>

        {isAuthenticated && <PostForm />}

        {loadingPosts ? (
          <CardSkeleton />
        ) : myPosts?.length > 0 ? (
          myPosts.map((post) => <Card key={post.id} post={post} />)
        ) : (
          <p className="text-gray-500 text-center">
            You haven't posted anything yet.
          </p>
        )}
      </div>
    </Layout>
  );
}
