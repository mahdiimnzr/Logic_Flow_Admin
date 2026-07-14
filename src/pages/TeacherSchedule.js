import {
  useGetCourseGroups,
  useGetCourses,
  useGetTeacherSchedule,
} from "../core/services/api/scheduleManagement/scheduleManagement.service";
import Spinner from "../@core/components/spinner/Fallback-spinner";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import CalendarComponent from "../components/ScheduleManagement/TeacherSchedule";

const TeacherSchedule = () => {
  const params = useSelector((state) => state.scheduleSlice.params.teacher);
  const { isLoading, data, refetch, isFetching } =
    useGetTeacherSchedule(params);
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

export default TeacherSchedule;
