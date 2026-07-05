import {
  Home,
  Airplay,
  Circle,
  Users,
  MessageSquare,
  Database,
  FileText,
  Book,
} from "react-feather";

export default [
  {
    id: "dashboard",
    title: "Dashboards",
    icon: <Home size={20} />,
    navLink: "/Dashboard",
  },
  {
    id: "ManagementCourses",
    title: "ManagementCourses",
    icon: <Book size={20} />,
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
      {
        id: "TechnologyManagementPage",
        title: "TechnologyManagement",
        icon: <Circle size={12} />,
        navLink: "ManagementCourses/TechnologyManagement",
      },
      {
        id: "LevelManagement",
        title: "LevelManagement",
        icon: <Circle size={12} />,
        navLink: "ManagementCourses/LevelManagement",
      },
      {
        id: "StatusManagement",
        title: "StatusManagement",
        icon: <Circle size={12} />,
        navLink: "ManagementCourses/StatusManagement",
      },
      {
        id: "DepartmentsManagements",
        title: "DepartmentsManagement",
        icon: <Circle size={12} />,
        navLink: "ManagementCourses/DepartmentsManagement",
      },
      {
        id: "TermsList",
        title: "TermsList",
        icon: <Circle size={12} />,
        navLink: "ManagementCourses/TermsList",
      },
    ],
  },
  {
    id: "blogsPage",
    title: "NewsManagement",
    icon: <FileText size={20} />,
    children: [
      {
        id: "blogs",
        title: "NewsList",
        icon: <Circle size={12} />,
        navLink: "/blogs/list",
      },
      {
        id: "blogAdd",
        title: "AddArticle",
        icon: <Circle size={12} />,
        navLink: "/blogs/add",
      },
      {
        id: "blogCategory",
        title: "ArticleCategories",
        icon: <Circle size={12} />,
        navLink: "/blogs/categories",
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
  {
    id: "buildings",
    title: "Buildings",
    icon: <Database size={20} />,
    navLink: "/Buildings/List",
  },
];
