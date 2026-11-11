import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import AppLayout from "./components/AppLayout/AppLayout";
import AccountPage from "./pages/AccountPage/AccountPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import PostsPage from "./pages/PostsPage/PostsPage";
import TravelStory from "./components/TravelStories/TravelStory";
import StoryCard from "./components/TravelStories/StoryCard";

import CommentPage from "./pages/CommentPage/CommentPage";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <AppLayout />,
      children: [
        { path: "/", element: <HomePage /> },
        { path: "/account", element: <AccountPage /> },
        { path: "/profile", element: <ProfilePage /> },
        {
          path: "/posts",
          element: <PostsPage />,
          children: [
            { index: true, element: <StoryCard /> },
            {
              path: ":id",
              children: [
                { index: true, element: <TravelStory /> },
                { path: "comments", element: <CommentPage /> },
              ],
            },
          ],
        },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
