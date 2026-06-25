// ** React Imports
import { Outlet, useNavigate } from "react-router-dom";

// ** Core Layout Import
// !Do not remove the Layout import
import Layout from "@layouts/VerticalLayout";

// ** Menu Items Array
import navigation from "@src/navigation/vertical";
import { useEffect } from "react";
import toast from "react-hot-toast";

const VerticalLayout = (props) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/Auth/Login");
      toast.error("ابتدا وارد حساب کاربری خود شوید");
    }
  }, []);
  return (
    <Layout menuData={navigation} {...props}>
      <Outlet />
    </Layout>
  );
};

export default VerticalLayout;
