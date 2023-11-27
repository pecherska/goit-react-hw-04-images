import { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Modal from './Modal/Modal';
import { getImages } from 'api/ImageApi';
import Loader from './Loader/Loader';
import Button from './Button/Button';
import { ImgModal, LoderContainer } from './App.styled';

export class App extends Component {
  state = {
    userSearch: '',
    images: '',
    error: '',
    page: 1,
    perPage: '12',
    isLoading: false,
    showModal: false,
    showLoadMore: false,
    modalImage: '',
    contentModal: '',
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.userSearch !== this.state.userSearch ||
      this.state.page !== prevState.page
    ) {
      if (prevState.userSearch !== this.state.userSearch) {
        this.setState({ images: '' });
      }
      this.handelImages();
    }
  }

  handelImages = async () => {
    try {
      this.setState({ isLoading: true });

      const data = await getImages(
        this.state.userSearch,
        this.state.page,
        this.state.perPage
      );

      const totalPage = Math.ceil(data.totalHits / this.state.perPage);

      this.setState(prevState => ({
        images: [...prevState.images, ...data.hits],
        isLoading: false,
        error: '',
      }));

      if (!data.totalHits) {
        toast.warn('Nothing found! Try again, please.');
        return;
      }
      if (data.totalHits) {
        toast.success(`Hooray! We found ${data.totalHits} images.`);
        this.setState({ showLoadMore: true });
      }
      if (this.state.page === totalPage) {
        this.setState({ showLoadMore: false });
      }
    } catch (error) {
      this.setState({
        error: error.response.data,
        isLoading: false,
      });
    }
  };

  handelSubmit = userSearch => {
    this.setState({ userSearch, page: 1 });
  };

  handleClick = () => {
    this.setState(prevState => {
      return {
        page: prevState.page + 1,
      };
    });
  };

  openModal = contentModal => {
    this.setState({
      showModal: true,
      contentModal,
    });

    const searchImage = this.state.images.find(
      image => image.id === contentModal
    );
    console.log(searchImage);
    this.setState({ modalImage: searchImage.largeImageURL });
  };

  closeModal = () => {
    this.setState({
      showModal: false,
      contentModal: '',
    });
  };

  render() {
    return (
      <div>
        <ToastContainer />
        {this.state.error && toast.error(this.state.error)}

        <Searchbar onSubmit={this.handelSubmit}></Searchbar>

        {this.state.images && (
          <ImageGallery images={this.state.images} onClick={this.openModal} />
        )}
        <LoderContainer>{this.state.isLoading && <Loader />}</LoderContainer>
        {this.state.showLoadMore && (
          <Button handleClick={this.handleClick}></Button>
        )}

        {this.state.showModal && (
          <Modal onClose={this.closeModal} content={this.state.contentModal}>
            <ImgModal src={this.state.modalImage} alt="" />
          </Modal>
        )}
      </div>
    );
  }
}
