import postParams from "../../common/postParams";
import putParams from "../../common/putParams";
import useGetQuery from "../../common/useGetQuery";

export const useGetAdminSchedule = (params) =>
  useGetQuery("AdminSchedule", "Schedual/GetAdminScheduals", params);
export const useGetTeacherSchedule = (params) =>
  useGetQuery("TeacherSchedule", "Schedual/GetTeacherScheduals", params);
export const useGetStudentSchedule = (params, options = {}) =>
  useGetQuery(
    "StudentSchedule",
    "Schedual/GetStudentScheduals",
    params,
    options,
  );
export const useGetCourses = (params) =>
  useGetQuery("ScheduleCoursesFilterAdmin", "Course/CourseList", params);
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
      weekNumber: body.weekNumber,
      rowEffect: body.rowEffect,
    },
  );
export const useGetCourseGroups = (params) =>
  useGetQuery("AdminScheduleCourseGroups", "CourseGroup", params);
export const useGetStudents = (params) =>
  useGetQuery("ScheduleStudentsList", "User/UserMannage", params);
export const useGetSessionStudents = (sessionId, options = {}) =>
  useGetQuery(
    `SessionStudents-${sessionId}`,
    `Schedual/GetStudentScheduals/${sessionId}`,
    undefined,
    options,
  );
