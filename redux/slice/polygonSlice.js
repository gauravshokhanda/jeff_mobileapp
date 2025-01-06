import { createSlice } from '@reduxjs/toolkit';

const polygonSlice = createSlice({
    name: 'polygon',
    initialState: {
        coordinates: [],
        area: 0,
    },
    reducers: {
        setPolygonData: (state, action) => {
            state.coordinates = action.payload.coordinates;
            state.area = action.payload.area;
        },
        clearPolygonData: (state) => {
            state.coordinates = [];
            state.area = 0;
        },
    },
});

export const { setPolygonData, clearPolygonData } = polygonSlice.actions;

export default polygonSlice.reducer;
