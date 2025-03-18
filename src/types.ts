type SeriesSize = 'sm' | 'md' | 'lg';

export interface SimpleOptions {
  text: string;
  showSeriesCount: boolean;
  seriesCountSize: SeriesSize;
}

export interface VideoProps {
  id: number;
  title: string;
  url: string;
  thumbnail: string;
  description: string;
}

export interface VideoListProps {
  videos: VideoProps[];
}