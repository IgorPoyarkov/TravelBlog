import { Outlet } from "react-router-dom";


interface PostsPageProps {}

const PostsPage = ({}: PostsPageProps) => {
  return (
    <>
      <Outlet />
    </>
  );
};

export default PostsPage;
