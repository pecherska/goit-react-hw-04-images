import { ImageListItems, Image } from './ImageGalleryItem.styled';
export const ImageGalleryItem = ({ image, onClick }) => {
  return (
    <>
      <ImageListItems>
        <Image
          src={image.webformatURL}
          alt={image.tag}
          onClick={() => {
            onClick(image.id);
          }}
        />
      </ImageListItems>
    </>
  );
};
export default ImageGalleryItem;
