export interface GalleryImage {
  src: string;
  size: ImageSize;
}
export interface GallerySection {
  title: string;
  images: GalleryImage[];
}
export type ImageSize = "tall" | "small" | "large";
