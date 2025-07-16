import Card from "../components/Card";
import CardSkeleton from "../components/CardSkeleton";
import Aside from "../components/Aside";
import { PostForm } from "../components/PostForm";
import { useContext } from "react";
import { UserContext } from "../context/UserProvider";
import { PostContext } from "../context/PostProvider";

export default function MyPosts() {
  const { isAuthenticated } = useContext(UserContext);
  const { getMyPosts, loadingPosts } = useContext(PostContext);

  const myPosts = getMyPosts();

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-64 hidden sm:block bg-white border-r border-gray-200 shadow-sm">
        <Aside />
      </aside>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-8 py-12 space-y-10">
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
      </main>
    </div>
  );
}
