import {
  useGetCourseGroups,
  useGetCourses,
  useGetStudents,
} from "../core/services/api/scheduleManagement/scheduleManagement.service";
import Spinner from "../@core/components/spinner/Fallback-spinner";
import CalendarComponent from "../components/ScheduleManagement/StudentSchedule";

const StudentSchedule = () => {
  const { isLoading: studentsLoading } = useGetStudents({ RowsOfPage: 500000 });
  const { isLoading: coursesLoading } = useGetCourses({ RowsOfPage: 500000 });
  const { isLoading: groupsLoading } = useGetCourseGroups({
    RowsOfPage: 500000,
  });

  return coursesLoading || groupsLoading || studentsLoading ? (
    <Spinner />
  ) : (
    <CalendarComponent />
  );
};

export default StudentSchedule;
