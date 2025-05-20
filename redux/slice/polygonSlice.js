import { createSlice } from '@reduxjs/toolkit';

const polygonSlice = createSlice({
  name: 'polygon',
  initialState: {
    coordinates: [],
    area: 0,
    city: '',
    state: '',
    zipCode: '',
    buildableArea:0,
    floors:0
  },
  reducers: {
    setPolygonData: (state, action) => {
      state.coordinates = action.payload.coordinates;
      state.area = action.payload.area;
      state.city = action.payload.city;
      state.state = action.payload.state;
      state.zipCode = action.payload.postalCode;
      state.buildableArea = action.payload.buildableArea;
      state.floors = action.payload.floors;



    },
    clearPolygonData: (state) => {
      state.coordinates = [];
      state.area = 0;
      state.city = '';
      state.state = '';
      state.zipCode = '';
      state.buildableArea=0;
      state.buildableArea=0;

    },
  },
});

export const { setPolygonData, clearPolygonData } = polygonSlice.actions;

export default polygonSlice.reducer;
