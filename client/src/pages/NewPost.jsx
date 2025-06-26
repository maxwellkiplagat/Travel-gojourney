import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Image, FileText } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from '../api/axios';

const NewPost = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    title: Yup.string().min(5).required('Title required'),
    location: Yup.string().min(3).required('Location required'),
    description: Yup.string().min(20).required('Description required'),
    image_url: Yup.string().url('Invalid URL').nullable(),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      await axios.post('/trips', values);
      navigate('/dashboard');
    } catch (e) {
      setFieldError('title', e.response?.data?.error || 'Failed to post trip');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900 mb-4 flex items-center">
          <ArrowLeft className="mr-2" /> Back
        </button>
        <h1 className="text-3xl font-bold mb-4">Share Your Trip</h1>
        <div className="bg-white p-8 rounded-xl shadow">
          <Formik initialValues={{ title: '', location: '', image_url: '', description: '' }}
            validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ isSubmitting, values }) => (
              <Form className="space-y-6">
                <div>
                  <label className="flex items-center mb-1">
                    <FileText className="mr-2" /> Title
                  </label>
                  <Field name="title" className="w-full border p-2 rounded" />
                  <ErrorMessage name="title" component="div" className="text-red-600 text-sm" />
                </div>

                <div>
                  <label className="flex items-center mb-1">
                    <MapPin className="mr-2" /> Location
                  </label>
                  <Field name="location" className="w-full border p-2 rounded" />
                  <ErrorMessage name="location" component="div" className="text-red-600 text-sm" />
                </div>

                <div>
                  <label className="flex items-center mb-1">
                    <Image className="mr-2" /> Image URL (optional)
                  </label>
                  <Field name="image_url" className="w-full border p-2 rounded" />
                  <ErrorMessage name="image_url" component="div" className="text-red-600 text-sm" />
                </div>

                <div>
                  <label className="flex items-center mb-1">
                    <FileText className="mr-2" /> Description
                  </label>
                  <Field as="textarea" name="description" className="w-full border p-2 rounded h-32" />
                  <ErrorMessage name="description" component="div" className="text-red-600 text-sm" />
                </div>

                <div className="flex justify-end space-x-4">
                  <button type="button" onClick={() => navigate(-1)} className="border px-4 py-2 rounded">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting}
                    className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">
                    {isSubmitting ? 'Posting...' : 'Post Trip'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default NewPost;