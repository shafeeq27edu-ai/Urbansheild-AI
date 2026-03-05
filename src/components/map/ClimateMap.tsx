"use client";

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useSimulationStore } from '@/store/useSimulationStore';
import { useRiskIntelligence } from '@/hooks/useRiskIntelligence';
import { generateSyntheticZones } from '@/engines/predictionEngine';
import { FeatureCollection, Point } from 'geojson';

// placeholder token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export default function ClimateMap() {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const { viewMode, focusedZoneId } = useSimulationStore();
    const { results } = useRiskIntelligence();

    useEffect(() => {
        if (map.current || !mapContainer.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [-74.006, 40.7128], // NYC default
            zoom: 11,
            pitch: 45,
            bearing: -17.6,
            antialias: true
        });

        map.current.on('load', () => {
            if (!map.current) return;

            // Add 3D buildings
            const layers = map.current.getStyle()?.layers;
            const labelLayerId = layers?.find(
                (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
            )?.id;

            map.current.addLayer(
                {
                    'id': 'add-3d-buildings',
                    'source': 'composite',
                    'source-layer': 'building',
                    'filter': ['==', 'extrude', 'true'],
                    'type': 'fill-extrusion',
                    'minzoom': 15,
                    'paint': {
                        'fill-extrusion-color': '#334155',
                        'fill-extrusion-height': ['get', 'height'],
                        'fill-extrusion-base': ['get', 'min_height'],
                        'fill-extrusion-opacity': 0.6
                    }
                },
                labelLayerId
            );

            // Add dynamic risk source
            map.current.addSource('risk-zones', {
                type: 'geojson',
                data: generateSyntheticZones()
            });

            map.current.addLayer({
                id: 'risk-heat',
                type: 'heatmap',
                source: 'risk-zones',
                paint: {
                    'heatmap-weight': ['get', 'risk'],
                    'heatmap-intensity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        0,
                        1,
                        15,
                        3
                    ],
                    'heatmap-radius': 60,
                    'heatmap-opacity': 0.8
                }
            });
        });

        map.current.on('click', (e) => {
            if (!map.current) return;
            const features = map.current.queryRenderedFeatures(e.point, {
                layers: ['risk-heat']
            });

            if (features.length > 0) {
                const zoneId = features[0].properties?.id;
                const coords = features[0].geometry as any;
                if (zoneId && coords.coordinates) {
                    useSimulationStore.getState().setFocusedZoneId(zoneId);
                    map.current.flyTo({
                        center: coords.coordinates,
                        zoom: 14,
                        pitch: 60,
                        duration: 2000,
                        essential: true
                    });
                }
            } else {
                // handle desalination of focused zone when clicking empty space
                useSimulationStore.getState().setFocusedZoneId(null);
                map.current.flyTo({
                    center: [-74.006, 40.7128],
                    zoom: 11,
                    pitch: 45,
                    duration: 1500
                });
            }
        });

        return () => {
            map.current?.remove();
        };
    }, []);

    // Update heatmap based on simulation intelligence
    useEffect(() => {
        if (!map.current || !map.current.isStyleLoaded()) return;

        // Update data with latest scores from results hook
        const updatedData: FeatureCollection<Point> = generateSyntheticZones();
        updatedData.features = updatedData.features.map(f => {
            const zoneData = results.find(r => r.id === f.properties?.id);
            return {
                ...f,
                properties: {
                    ...f.properties,
                    risk: viewMode === 'flood' ? zoneData?.flood.score || 0 : zoneData?.heat.score || 0
                }
            };
        });

        (map.current.getSource('risk-zones') as mapboxgl.GeoJSONSource).setData(updatedData);

        // Selection Highlight Layer
        if (!map.current.getLayer('zone-highlight')) {
            map.current.addLayer({
                id: 'zone-highlight',
                type: 'circle',
                source: 'risk-zones',
                paint: {
                    'circle-radius': 120,
                    'circle-color': 'transparent',
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#3b82f6',
                    'circle-stroke-opacity': [
                        'case',
                        ['==', ['get', 'id'], focusedZoneId || ''],
                        1,
                        0
                    ],
                }
            });
        } else {
            map.current.setPaintProperty('zone-highlight', 'circle-stroke-opacity', [
                'case',
                ['==', ['get', 'id'], focusedZoneId || ''],
                1,
                0
            ]);
        }

        // Dynamic color scaling
        const colorScale: any = viewMode === 'flood'
            ? [
                'interpolate', ['linear'], ['heatmap-density'],
                0, 'rgba(0,0,255,0)',
                0.2, 'rgba(0,120,255,0.4)',
                0.5, 'rgba(0,255,255,0.7)',
                0.8, 'rgba(255,255,255,0.8)',
                1, 'rgba(255,255,255,1)'
            ]
            : [
                'interpolate', ['linear'], ['heatmap-density'],
                0, 'rgba(255,0,0,0)',
                0.2, 'rgba(255,100,0,0.4)',
                0.5, 'rgba(255,50,0,0.7)',
                0.8, 'rgba(255,255,0,0.8)',
                1, 'rgba(255,255,255,1)'
            ];

        map.current.setPaintProperty('risk-heat', 'heatmap-color', colorScale);
    }, [results, viewMode, focusedZoneId]);

    return (
        <div className="relative h-full w-full">
            <div ref={mapContainer} id="map-container" className="h-full w-full" />
            <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.3)_100%)]" />
        </div>
    );
}
