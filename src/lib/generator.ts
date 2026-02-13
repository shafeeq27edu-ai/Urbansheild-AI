import { FeatureCollection, Point } from 'geojson';

export const generateSyntheticZones = (): FeatureCollection<Point> => {
    return {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                properties: { id: 'Z1', risk: 0.6, name: 'Downtown Core' },
                geometry: { type: 'Point', coordinates: [-74.006, 40.7128] }
            },
            {
                type: 'Feature',
                properties: { id: 'Z2', risk: 0.3, name: 'Industrial East' },
                geometry: { type: 'Point', coordinates: [-73.986, 40.7228] }
            },
            {
                type: 'Feature',
                properties: { id: 'Z3', risk: 0.8, name: 'Waterfront West' },
                geometry: { type: 'Point', coordinates: [-74.020, 40.7028] }
            },
            {
                type: 'Feature',
                properties: { id: 'Z4', risk: 0.2, name: 'Uptown Residential' },
                geometry: { type: 'Point', coordinates: [-73.966, 40.7828] }
            },
            {
                type: 'Feature',
                properties: { id: 'Z5', risk: 0.5, name: 'Tech Park South' },
                geometry: { type: 'Point', coordinates: [-74.010, 40.6928] }
            },
            {
                type: 'Feature',
                properties: { id: 'Z6', risk: 0.1, name: 'Greenway Outskirts' },
                geometry: { type: 'Point', coordinates: [-73.950, 40.7928] }
            }
        ]
    };
};
