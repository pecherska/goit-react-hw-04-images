import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Modal from './Modal/Modal';
import { getImages } from 'api/ImageApi';
import Loader from './Loader/Loader';
import Button from './Button/Button';
import { ImgModal, LoderContainer } from './App.styled';

export const App = () => {
  const [userSearch, setUserSearch] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [perPage] = useState('12');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [contentModal, setContentModal] = useState('');

  useEffect(() => {
    if (userSearch || page !== 1) {
      const handelImages = async () => {
        try {
          setIsLoading(true);
          console.log(userSearch);
          const data = await getImages(userSearch, page, perPage);
          console.log(data);
          const totalPage = Math.ceil(data.totalHits / perPage);

          setImages(prevState => [...prevState, ...data.hits]);
          setIsLoading(false);
          setError('');

          if (!data.totalHits) {
            toast.warn('Nothing found! Try again, please.');
            return;
          }

          if (data.totalHits) {
            toast.success(`Hooray! We found ${data.totalHits} images.`);
            setShowLoadMore(true);
          }

          if (page === totalPage) {
            setShowLoadMore(false);
          }
        } catch (error) {
          setError(error.response.data);
          setIsLoading(false);
        }
      };
      handelImages();
    }
  }, [page, userSearch, perPage]);

  const handelSubmit = userSearch => {
    setUserSearch(userSearch);
    setPage(1);
  };

  const handleClick = () => {
    setPage(prevPage => prevPage + 1);
  };

  const openModal = contentModal => {
    setShowModal(true);
    setContentModal(contentModal);

    const searchImage = images.find(image => image.id === contentModal);
    setModalImage(searchImage.largeImageURL);
  };

  const closeModal = () => {
    setShowModal(false);
    setContentModal('');
  };

  return (
    <div>
      <ToastContainer />
      {error && toast.error(error)}

      <Searchbar onSubmit={handelSubmit}></Searchbar>

      {images.length > 0 && (
        <ImageGallery images={images} onClick={openModal} />
      )}
      <LoderContainer>{isLoading && <Loader />}</LoderContainer>
      {showLoadMore && <Button handleClick={handleClick}></Button>}

      {showModal && (
        <Modal onClose={closeModal} content={contentModal}>
          <ImgModal src={modalImage} alt="" />
        </Modal>
      )}
    </div>
  );
};
