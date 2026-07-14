import postParams from "../../common/postParams";
import putParams from "../../common/putParams";
import useGetQuery from "../../common/useGetQuery";

export const useGetAdminSchedule = (params) =>
  useGetQuery("AdminSchedule", "Schedual/GetAdminScheduals", params);
export const useGetCourses = () =>
  useGetQuery("ScheduleCoursesFilterAdmin", "Course/CourseList");
export const updateScheduleStatus = (body) =>
  putParams("Schedual/LockToRiase", body);
export const addSchedule = (body) =>
  postParams(
    `Schedual/AddSchedualSingle?currentCurseId=${body.currentCurseId}`,
    {
      courseGroupId: body.courseGroupId,
      startDate: body.startDate,
      startTime: body.startTime,
      endTime: body.endTime,
    },
  );
export const useGetCourseGroups = () =>
  useGetQuery("AdminScheduleCourseGroups", "CourseGroup");
