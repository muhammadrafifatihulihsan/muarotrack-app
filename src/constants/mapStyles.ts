// MapLibre style objects for 4 map modes — spec v2 section 7.8.
// Each mode is an inline style JSON object compatible with MapLibre.
// Attribution required: "© OpenStreetMap contributors" (all modes).

export type MapMode = "normal" | "satellite" | "dark" | "bahariOverlay";

export const mapModeLabel: Record<MapMode, string> = {
    normal: "Normal",
    satellite: "Satellite",
    dark: "Malam",
    bahariOverlay: "Bahari",
};

// ---------------------------------------------------------------------------
// MapLibre Style Objects (inline JSON — no external style URL required)
// ---------------------------------------------------------------------------

export const mapStyles: Record<MapMode, object> = {
    normal: {
        version: 8,
        sources: {
            osm: {
                type: "raster",
                tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
                tileSize: 256,
                attribution: "© OpenStreetMap contributors",
            },
        },
        layers: [
            {
                id: "osm",
                type: "raster",
                source: "osm",
            },
        ],
    },

    satellite: {
        version: 8,
        sources: {
            esri: {
                type: "raster",
                tiles: ["https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
                tileSize: 256,
                attribution: "© Esri World Imagery, © OpenStreetMap contributors",
            },
        },
        layers: [
            {
                id: "esri-sat",
                type: "raster",
                source: "esri",
            },
        ],
    },

    dark: {
        version: 8,
        sources: {
            cartoDark: {
                type: "raster",
                tiles: ["https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png"],
                tileSize: 256,
                attribution: "© CARTO, © OpenStreetMap contributors",
            },
        },
        layers: [
            {
                id: "carto-dark",
                type: "raster",
                source: "cartoDark",
            },
        ],
    },

    bahariOverlay: {
        version: 8,
        sources: {
            osmBase: {
                type: "raster",
                tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
                tileSize: 256,
                attribution: "© OpenStreetMap contributors",
            },
            seaMark: {
                type: "raster",
                tiles: ["https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"],
                tileSize: 256,
                attribution: "© OpenSeaMap, © OpenStreetMap contributors",
            },
        },
        layers: [
            {
                id: "osm-base",
                type: "raster",
                source: "osmBase",
            },
            {
                id: "seamark-overlay",
                type: "raster",
                source: "seaMark",
            },
        ],
    },
};

// ---------------------------------------------------------------------------
// Legacy exports (used by old MapViewWrapper / MapLibreView)
// ---------------------------------------------------------------------------

/** @deprecated use mapStyles instead */
export const mapTileUrls = {
    normal: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    satellite: "https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    bahariOverlay: "https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png",
} as const;

export const mapAttribution = {
    normal: "© OpenStreetMap contributors",
    satellite: "© Esri World Imagery, © OpenStreetMap contributors",
    dark: "© CARTO, © OpenStreetMap contributors",
    bahari: "© OpenSeaMap, © OpenStreetMap contributors",
} as const;