import deleteParams from "../../common/deleteParams";
import postParams from "../../common/postParams";
import useGetQuery from "../../common/useGetQuery";

export const useGetSessionDetail = (sessionId, options = {}) =>
  useGetQuery(
    `SessionDetail-${sessionId}`,
    `Session/SessionDetail?SessionId=${sessionId}`,
    undefined,
    options,
  );
export const sendFileUrl = (body) =>
  postParams(
    `Session/AddSessionFileWithUrl?SessionId=${body.SessionId}&Url=${body.Url}`,
  );
export const sendFile = (body) => postParams("Session/AddSessionFile", body);
export const deleteFile = (body) =>
  deleteParams("Session/DeleteSessionFile", body);
export const useGetSessionHomeWorks = (sessionId, options = {}) =>
  useGetQuery(
    `SessionHomeWork-${sessionId}`,
    `Session/GetSessionHomeWork?SessionId=${sessionId}`,
    undefined,
    options,
  );
export const addHomeWork = (body) =>
  postParams("Session/AddSessionHomeWork", body);
