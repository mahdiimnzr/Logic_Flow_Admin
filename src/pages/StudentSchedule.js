import {
  useGetCourseGroups,
  useGetCourses,
  useGetStudentSchedule,
  useGetTeacherSchedule,
} from "../core/services/api/scheduleManagement/scheduleManagement.service";
import Spinner from "../@core/components/spinner/Fallback-spinner";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import CalendarComponent from "../components/ScheduleManagement/StudentSchedule";

const StudentSchedule = () => {
  const params = useSelector((state) => state.scheduleSlice.params.students);
  const { isLoading, data, refetch, isFetching } =
    useGetStudentSchedule(params);
  const { isLoading: coursesLoading } = useGetCourses();
  const { isLoading: groupsLoading } = useGetCourseGroups();

  useEffect(() => {
    refetch();
  }, [params]);
  return isLoading || coursesLoading ? (
    <Spinner />
  ) : (
    <CalendarComponent data={data?.data} isFetching={isFetching} />
  );
};

export default StudentSchedule;
