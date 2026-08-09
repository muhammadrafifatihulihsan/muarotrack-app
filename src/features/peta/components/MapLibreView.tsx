import React, { useCallback, useMemo, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Platform, Animated } from "react-native";
import MapboxGL from "@maplibre/maplibre-react-native";
import { usePetaStore } from "@/stores/petaStore";
import { mapStyles } from "@/constants/mapStyles";
import { colors } from "@/constants/theme";
import { POSISI_LAUT_DEFAULT, DEFAULT_ZOOM } from "@/constants/config";

const MEASURE_LINE_COLOR = "#FF5722";

/** Generate an irregular polygon (12 vertices) around a center point.
 *  Each vertex is offset by a random distance (200-500m) and random angle.
 *  This creates a non-perfect "analysis blob" shape. */
function generateIrregularPolygon(
    centerLat: number,
    centerLng: number,
    vertexCount: number = 12,
): number[][] {
    const vertices: number[][] = [];
    // Approx degrees per meter at equator: 1 deg ≈ 111,320 m
    const degPerMeter = 1 / 111320;

    // Pre-generate offsets with some variation
    for (let i = 0; i < vertexCount; i++) {
        const angle = (i / vertexCount) * 2 * Math.PI;
        // Random distance between 400m and 900m (larger highlight)
        const distanceM = 400 + Math.random() * 500;
        // Add slight angle jitter (±15 degrees)
        const jitteredAngle = angle + (Math.random() - 0.5) * (Math.PI / 6);
        const dLat = distanceM * Math.cos(jitteredAngle) * degPerMeter;
        const dLng = distanceM * Math.sin(jitteredAngle) * degPerMeter * Math.cos(centerLat * Math.PI / 180);
        vertices.push([centerLng + dLng, centerLat + dLat]);
    }

    // Close the polygon
    vertices.push(vertices[0]);
    return vertices;
}

interface MapLibreViewProps {
    shipLat?: number;
    shipLng?: number;
    shipHeading?: number;
    highlightZona?: { lat: number; lng: number } | null;
    onPressMap?: (lat: number, lng: number) => void;
}

/** Small animated pulsing dot for the fisherman position marker */
function PulsingDot() {
    const pulse = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, {
                    toValue: 0.3,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulse, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ]),
        );
        loop.start();
        return () => loop.stop();
    }, [pulse]);

    return (
        <Animated.View style={[styles.dotMarker, { opacity: pulse }]}>
            <View style={styles.dotInner} />
        </Animated.View>
    );
}

export default function MapLibreView({ shipLat, shipLng, shipHeading, highlightZona, onPressMap }: MapLibreViewProps) {
    const mapMode = usePetaStore((s) => s.mapMode);
    const measureMode = usePetaStore((s) => s.measureMode);
    const measurePoints = usePetaStore((s) => s.measurePoints);
    const updateMeasurePoint = usePetaStore((s) => s.updateMeasurePoint);

    const centerLat = shipLat ?? POSISI_LAUT_DEFAULT.lat;
    const centerLng = shipLng ?? POSISI_LAUT_DEFAULT.lng;

    const currentStyle = mapStyles[mapMode] ?? mapStyles.normal;

    // Memoize Camera so it's created once and never re-rendered
    // This prevents camera reset when adding/removing measure points
    const camera = useMemo(() => (
        <MapboxGL.Camera
            centerCoordinate={[centerLng, centerLat]}
            zoomLevel={DEFAULT_ZOOM}
        />
    ), []);

    const handlePress = useCallback(
        (feature: any) => {
            if (measureMode && onPressMap && feature?.geometry?.coordinates) {
                const [lng, lat] = feature.geometry.coordinates;
                onPressMap(lat, lng);
            }
        },
        [measureMode, onPressMap]
    );

    return (
        <View style={styles.container}>
            <MapboxGL.MapView
                style={styles.map}
                mapStyle={currentStyle}
                logoEnabled={false}
                compassEnabled={false}
                onPress={handlePress}
                attributionEnabled={false}
            >
                {camera}

                {/* Ship marker — small pulsing dot */}
                {shipLat != null && shipLng != null && (
                    <MapboxGL.MarkerView
                        id="ship-marker"
                        coordinate={[shipLng, shipLat]}
                    >
                        <PulsingDot />
                    </MapboxGL.MarkerView>
                )}

                {/* Measure points */}
                {measureMode &&
                    measurePoints.map((p, i) => (
                        <MapboxGL.MarkerView
                            key={i}
                            id={`measure-${i}`}
                            coordinate={[p.lng, p.lat]}
                        >
                            <View style={styles.measureMarker}>
                                <Text style={styles.measureMarkerText}>{i + 1}</Text>
                            </View>
                        </MapboxGL.MarkerView>
                    ))}

                {/* Zona highlight — irregular polygon fill */}
                {highlightZona && (
                    <MapboxGL.ShapeSource
                        id="zona-highlight"
                        shape={{
                            type: "FeatureCollection",
                            features: [
                                {
                                    type: "Feature",
                                    properties: {},
                                    geometry: {
                                        type: "Polygon",
                                        coordinates: [
                                            generateIrregularPolygon(
                                                highlightZona.lat,
                                                highlightZona.lng,
                                                12,
                                            ),
                                        ],
                                    },
                                },
                            ],
                        }}
                    >
                        <MapboxGL.FillLayer
                            id="zona-highlight-fill"
                            style={{
                                fillColor: "rgba(186,26,26,0.30)",
                                fillOutlineColor: "#ba1a1a",
                                fillOpacity: 0.8,
                            }}
                        />
                        <MapboxGL.LineLayer
                            id="zona-highlight-border"
                            style={{
                                lineColor: "#ba1a1a",
                                lineWidth: 3,
                            }}
                        />
                    </MapboxGL.ShapeSource>
                )}

                {/* Measure line */}
                {measureMode && measurePoints.length >= 2 && (
                    <MapboxGL.ShapeSource
                        id="measure-line"
                        shape={{
                            type: "FeatureCollection",
                            features: [
                                {
                                    type: "Feature",
                                    properties: {},
                                    geometry: {
                                        type: "LineString",
                                        coordinates: measurePoints.map(p => [p.lng, p.lat]),
                                    },
                                },
                            ],
                        }}
                    >
                        <MapboxGL.LineLayer
                            id="measure-line-layer"
                            style={{
                                lineColor: MEASURE_LINE_COLOR,
                                lineWidth: 5,
                            }}
                        />
                    </MapboxGL.ShapeSource>
                )}
            </MapboxGL.MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: "hidden",
    },
    map: {
        flex: 1,
    },
    dotMarker: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: "rgba(61,94,132,0.3)",
        alignItems: "center",
        justifyContent: "center",
    },
    dotInner: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.primary,
    },
    measureMarker: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: MEASURE_LINE_COLOR,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2.5,
        borderColor: "#FFFFFF",
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
            },
            android: {
                elevation: 6,
            },
        }),
    },
    measureMarkerText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 11,
    },
});