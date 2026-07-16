import CalendarComponent from "../components/ScheduleManagement/AdminSchedule";
import {
  useGetAdminSchedule,
  useGetCourseGroups,
  useGetCourses,
} from "../core/services/api/scheduleManagement/scheduleManagement.service";
import Spinner from "../@core/components/spinner/Fallback-spinner";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const AdminSchedule = () => {
  const params = useSelector((state) => state.scheduleSlice.params.admin);
  const { isLoading, data, refetch, isFetching } = useGetAdminSchedule(params);
  const { isLoading: coursesLoading } = useGetCourses({ RowsOfPage: 500000 });
  const { isLoading: groupsLoading } = useGetCourseGroups({
    RowsOfPage: 500000,
  });

  useEffect(() => {
    refetch();
  }, [params]);
  return isLoading || coursesLoading ? (
    <Spinner />
  ) : (
    <CalendarComponent data={data?.data} isFetching={isFetching} />
  );
};

export default AdminSchedule;
