import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth() 
  const navigate = useNavigate()

  const schema = Yup.object({
    username: Yup.string().min(3, 'Min 3 characters').required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Min 6 characters').required('Required'),
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        <Formik
          initialValues={{ username: '', email: '', password: '' }}
          validationSchema={schema}
          onSubmit={async (values, { setSubmitting, setFieldError }) => {
            try {
              await register(values) // ✅ pass full values object
              navigate('/dashboard')
            } catch (err) {
              setFieldError('email', err.response?.data?.error || 'Signup failed')
            } finally {
              setSubmitting(false)
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <Field
                  name="username"
                  type="text"
                  placeholder="Username"
                  className="w-full px-3 py-2 border rounded"
                />
                <ErrorMessage name="username" component="div" className="text-red-600 text-sm" />
              </div>

              <div>
                <Field
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="w-full px-3 py-2 border rounded"
                />
                <ErrorMessage name="email" component="div" className="text-red-600 text-sm" />
              </div>

              <div>
                <Field
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="w-full px-3 py-2 border rounded"
                />
                <ErrorMessage name="password" component="div" className="text-red-600 text-sm" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {isSubmitting ? 'Signing up...' : 'Sign Up'}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}