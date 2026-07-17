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
  const { isLoading, data, isFetching } = useGetTeacherSchedule(params);
  const { isLoading: coursesLoading } = useGetCourses({ RowsOfPage: 500000 });
  const { isLoading: groupsLoading } = useGetCourseGroups({
    RowsOfPage: 500000,
  });

  return groupsLoading || coursesLoading ? (
    <Spinner />
  ) : (
    <CalendarComponent
      data={data?.data}
      isFetching={isFetching}
      isLoading={isLoading}
    />
  );
};

export default TeacherSchedule;
