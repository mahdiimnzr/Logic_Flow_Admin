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
        title: "CreateNewCourse",
        icon: <Circle size={12} />,
        navLink: "/Courses/Add",
      },
    ],
  },
  {
    id: "blogsPage",
    title: "مدیریت اخبار",
    icon: <Home size={20} />,
    children: [
      {
        id: "blogs",
        title: " لیست اخبار",
        icon: <Circle size={12} />,
        navLink: "/blogs/list",
      },
      {
        id: "blogAdd",
        title: "اضافه کردن مقاله",
        icon: <Circle size={12} />,
        navLink: "/blogs/add",
      },
      {
        id: "blogCategory",
        title: "دسته بندی مقالات",
        icon: <Circle size={12} />,
        navLink: "/blogs/categories",
      },
    ],
  },
  {
    id: "ManagementCourses",
    title: "مدیریت دوره ها",
    icon: <Home size={20} />,
    children: [
      {
        id: "TechnologyManagementPage",
        title: "مدیریت تکنولوژی",
        icon: <Circle size={12} />,
        navLink: "ManagementCourses/TechnologyManagement",
      },
      {
        id: "LevelManagement",
        title: "مدیریت سطح دوره ها",
        icon: <Circle size={12} />,
        navLink: "ManagementCourses/LevelManagement",
      },
      {
        id: "StatusManagement",
        title: "مدیریت وضعیت دوره ها",
        icon: <Circle size={12} />,
        navLink: "ManagementCourses/StatusManagement",
      },
      {
        id: "DepartmentsManagements",
        title: "مدیریت بخش ها",
        icon: <Circle size={12} />,
        navLink: "ManagementCourses/DepartmentsManagement",
      },
      {
        id: "TermsList",
        title: "لیست ترم ها",
        icon: <Circle size={12} />,
        navLink: "ManagementCourses/TermsList",
      },
    ],
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
