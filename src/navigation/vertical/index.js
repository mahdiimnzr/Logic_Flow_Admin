import { title } from "process";
import { Home, Airplay, Circle, Users, MessageSquare } from "react-feather";

export default [
  {
    id: "dashboard",
    title: "Dashboards",
    icon: <Home size={20} />,
    navLink: "/Dashboard",
  },
  {
    id: "coursesPage",
    title: "Courses",
    icon: <Home size={20} />,
    children: [
      {
        id: "courses",
        title: "List",
        icon: <Circle size={12} />,
        navLink: "/Courses/List",
      },
      {
        id: "coursesAdd",
        title: "ساخت دوره جدید",
        icon: <Circle size={12} />,
        navLink: "/Courses/add",
      },
    ],
  },
  {
    id: "blogsPage",
    title: "اخبار",
    icon: <Home size={20} />,
    children: [
      {
        id:"blogs",
        title:" لیست اخبار",
        icon: <Circle size={12} />,
        navLink:"/blogs/list",
      },
      {
        id:"blogAdd",
        title:"اضافه کردن مقاله",
        icon: <Circle size={12} />,
        navLink:"/blogs/add",
      },
    ]
  },
  {
    id: "comments",
    title: "Comments",
    icon: <MessageSquare size={20} />,
    navLink: "/Comments/List",
  },
  {
    id: "usersPage",
    title: "Users",
    icon: <Users size={20} />,
    navLink: "/Users/List",
  },
];
