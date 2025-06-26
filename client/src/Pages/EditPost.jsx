import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from '../api/axios';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    axios.get(`/trips/${id}`)
      .then(res => {
        setInitialValues({
          title: res.data.title,
          location: res.data.location,
          description: res.data.description,
          image_url: res.data.image_url
        });
      })
      .catch(() => navigate('/'));
  }, [id, navigate]);

  const validationSchema = Yup.object({
    title: Yup.string().required('Required'),
    location: Yup.string().required('Required'),
    description: Yup.string().required('Required'),
    image_url: Yup.string().url('Must be a valid URL').required('Required')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await axios.patch(`/trips/${id}`, values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!initialValues) return <div>Loading...</div>;

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-4">Edit Trip</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <Field name="title" placeholder="Title" className="w-full px-3 py-2 border rounded" />
              <ErrorMessage name="title" component="div" className="text-red-600 text-sm" />
            </div>
            <div>
              <Field name="location" placeholder="Location" className="w-full px-3 py-2 border rounded" />
              <ErrorMessage name="location" component="div" className="text-red-600 text-sm" />
            </div>
            <div>
              <Field name="image_url" placeholder="Image URL" className="w-full px-3 py-2 border rounded" />
              <ErrorMessage name="image_url" component="div" className="text-red-600 text-sm" />
            </div>
            <div>
              <Field
                name="description"
                as="textarea"
                rows="4"
                placeholder="Description"
                className="w-full px-3 py-2 border rounded"
              />
              <ErrorMessage name="description" component="div" className="text-red-600 text-sm" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {isSubmitting ? 'Updating...' : 'Update Trip'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}