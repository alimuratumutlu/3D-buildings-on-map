import * as turf from "@turf/turf";

export const calculatePolygonArea = (coordinates: any): number => {
	// Input validation
	if (!coordinates || !Array.isArray(coordinates)) {
		console.error('Invalid coordinates input');
		return 0;
	}

	try {
		let polygon;
		
		// Check if coordinates is empty
		if (coordinates.length === 0) {
			return 0;
		}

		// Determine if it's a MultiPolygon or Polygon by checking the nesting level
		if (Array.isArray(coordinates[0]) && 
			Array.isArray(coordinates[0][0]) && 
			Array.isArray(coordinates[0][0][0])) {
			// MultiPolygon structure
			polygon = turf.multiPolygon([coordinates[0]]);
		} else if (Array.isArray(coordinates[0]) && 
				   Array.isArray(coordinates[0][0])) {
			// Single Polygon structure
			polygon = turf.polygon(coordinates);
		} else {
			console.error('Invalid polygon structure');
			return 0;
		}

		// Calculate area in square meters
		const area = turf.area(polygon);
		return area;
	} catch (error) {
		console.error('Error calculating polygon area:', error);
		return 0;
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
