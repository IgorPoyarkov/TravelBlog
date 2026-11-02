import { Outlet } from "react-router-dom";
import Container from "../Container/Container";
import Header from "../Header/Header";

const AppLayout = () => {
  return (
    <div className="app">
      <Container>
        <Header />

        <Outlet />
      </Container>
    </div>
  );
};

export default AppLayout;
