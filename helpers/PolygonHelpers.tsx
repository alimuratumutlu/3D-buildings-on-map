import * as turf from "@turf/turf";

export const calculatePolygonArea = async (
	coordinates: any,
	callback: (e: any) => void
) => {
	// Check if it's a MultiPolygon
	let polygon;
	if (coordinates[0][0][0]) {
		// MultiPolygon
		polygon = turf.multiPolygon([coordinates[0]]);
	} else if (coordinates[0][0]) {
		// Polygon
		polygon = turf.polygon([coordinates[0]]);
	}

	if (polygon) {
		let area = turf.area(polygon);
		callback(Math.ceil(area));
	} else {
		callback("Invalid coordinates");
	}
};

export const resizePolygon = async (
	data: any,
	factor: number = 0.5,
	callback: (e: any) => void
) => {
	let polygon;
	// Check if it's a MultiPolygon
	if (data?.coordinates[0][0][0]) {
		// MultiPolygon
		polygon = turf.multiPolygon([data.coordinates[0]]);
	} else if (data?.coordinates[0][0]) {
		// Polygon
		polygon = turf.polygon([data.coordinates[0]]);
	}

	if (polygon) {
		const resizedPolygon = turf.transformScale(polygon, factor, {
			origin: "center",
		});
		callback(resizedPolygon.geometry);
	} else {
		callback("Invalid coordinates");
	}
};
