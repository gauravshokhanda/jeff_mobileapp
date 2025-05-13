// components/CustomPolygon.js
import React, { useRef } from 'react';
import { Polygon } from 'react-native-maps';

const CustomPolygon = ({ fillColor, ...props }) => {
  const polygonRef = useRef(null);

  const onLayout = () => {
    if (polygonRef.current) {
      polygonRef.current.setNativeProps({ fillColor });
    }
  };

  return (
    <Polygon
      ref={polygonRef}
      onLayout={onLayout}
      fillColor={fillColor}
      {...props}
    />
  );
};

export default CustomPolygon;
