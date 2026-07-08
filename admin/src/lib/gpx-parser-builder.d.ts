declare module "gpx-parser-builder" {
  export interface GpxWaypoint {
    $: { lat: number; lon: number };
    ele?: number;
    name?: string;
  }

  export interface GpxTrackSegment {
    trkpt?: GpxWaypoint[];
  }

  export interface GpxTrack {
    name?: string;
    desc?: string;
    trkseg?: GpxTrackSegment[];
  }

  export interface GpxMetadata {
    name?: string;
    desc?: string;
  }

  export default class GPX {
    metadata?: GpxMetadata;
    wpt?: GpxWaypoint[];
    trk?: GpxTrack[];
    static parse(gpxString: string): GPX | null;
  }
}
