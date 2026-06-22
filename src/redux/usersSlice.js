import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
  name: "userSlice",
  initialState: {
    params: {
      PageNumber: 1,
      RowsOfPage: 10,
      SortingCol: "desc",
      SortType: "insertDate",
      Query: null,
      IsActiveUser: null,
      IsDeletedUser: null,
      roleId: null,
    },
  },
  reducers: {
    updateParams: (state, action) => {
      const { key, value } = action.payload;
      state.params = { ...state.params, [key]: value };
    },
  },
});

export default usersSlice;
