import Card from "../components/Card";
import CardSkeleton from "../components/CardSkeleton";
import Aside from "../components/Aside";
import { PostForm } from "../components/PostForm";
import { useContext } from "react";
import { UserContext } from "../context/UserProvider";
import { PostContext } from "../context/PostProvider";

export default function Home() {
  const { isAuthenticated } = useContext(UserContext);
  const { posts, loadingPosts } = useContext(PostContext);

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-64 hidden sm:block bg-white border-r border-gray-200 shadow-sm">
        <Aside />
      </aside>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-8 py-12 space-y-10">
          <h1 className="text-3xl font-bold text-blue-500">Latest Posts</h1>

          {isAuthenticated && <PostForm />}

          {loadingPosts && posts.length === 0 ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : posts.length > 0 ? (
            posts.map((post) => <Card key={post.id} post={post} />)
          ) : (
            <p className="text-gray-500 text-center">No posts available.</p>
          )}
        </div>
      </main>
    </div>
  );
}
