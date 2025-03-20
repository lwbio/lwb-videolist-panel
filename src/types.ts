
export interface SimpleOptions {
  staticPrefix: string;
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
