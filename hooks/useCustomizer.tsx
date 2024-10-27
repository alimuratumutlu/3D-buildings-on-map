import { useContext } from "react";
import BuildingContext from "store/BuildingContext";

// Helpers

export default function useCustomizer() {
  const {
    state,
    setFloorHeight,
    setNumberOfFloors,
  } = useContext(BuildingContext);

  const handleFloorHeightChange = (event: any, newValue: number | number[]) => {
    setFloorHeight(newValue as number);
  };

  const handleNumberOfFloorsChange = (
    event: any,
    newValue: number | number[]
  ) => {
    setNumberOfFloors(newValue as number);
  };

  const options = [
    {
      label: "Floor Height",
      value: state.floorHeight,
      onChange: handleFloorHeightChange,
      max: 10,
      unit: "m",
    },
    {
      label: "Floor Count",
      value: state.numberOfFloors,
      onChange: handleNumberOfFloorsChange,
      max: 1000,
      unit: "",
    },
  ];

  return {
    options,
    handleFloorHeightChange,
    handleNumberOfFloorsChange,
  };
}
