import { createSlice } from '@reduxjs/toolkit';

const polygonSlice = createSlice({
  name: 'polygon',
  initialState: {
    coordinates: [],
    area: 0,
    city: '',
    state: '',
    zipCode: '',
  },
  reducers: {
    setPolygonData: (state, action) => {
      state.coordinates = action.payload.coordinates;
      state.area = action.payload.area;
      state.city = action.payload.city;
      state.state = action.payload.state; // ✅ Save state here
      state.zipCode = action.payload.postalCode;
    },
    clearPolygonData: (state) => {
      state.coordinates = [];
      state.area = 0;
      state.city = '';
      state.state = '';
      state.zipCode = '';
    },
  },
});

export const { setPolygonData, clearPolygonData } = polygonSlice.actions;

export default polygonSlice.reducer;
