import { FormikForm, FormikInput, FormButton } from './Searchbar.styled';
import { Formik } from 'formik';

const Searchbar = ({ onSubmit }) => {
  const handleSubmit = (values, actions) => {
    console.log(values);
    onSubmit(values.userSearch);
    console.log(values.userSearch);
    actions.resetForm();
  };

  return (
    <header>
      <Formik initialValues={{ userSearch: '' }} onSubmit={handleSubmit}>
        <FormikForm>
          <FormButton type="submit"></FormButton>

          <FormikInput
            type="text"
            name="userSearch"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
          />
        </FormikForm>
      </Formik>
    </header>
  );
};

export default Searchbar;
