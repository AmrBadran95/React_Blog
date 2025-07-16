import Card from "../components/Card";
import CardSkeleton from "../components/CardSkeleton";
import Aside from "../components/Aside";
import { useContext } from "react";
import { UserContext } from "../context/UserProvider";
import { PostContext } from "../context/PostProvider";

export default function MyLikes() {
  const { isAuthenticated } = useContext(UserContext);
  const { getMyLikes, loadingPosts } = useContext(PostContext);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">
          You must be logged in to view liked posts.
        </p>
      </div>
    );
  }

  const likedPosts = getMyLikes();

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-64 hidden sm:block bg-white border-r border-gray-200 shadow-sm">
        <Aside />
      </aside>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-8 py-12 space-y-10">
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
      </main>
    </div>
  );
}
