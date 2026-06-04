import { courseOptions } from '../data/dropdownOptions';

export function normalizeCourse(course) {
  const cleanedCourse = course.trim();
  const matchedCourse = courseOptions.find((option) => {
    return option.value.toLowerCase() === cleanedCourse.toLowerCase() || option.label.toLowerCase() === cleanedCourse.toLowerCase();
  });

  return matchedCourse?.value || cleanedCourse.toUpperCase();
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validateSignUp(values) {
  const requiredFields = ['fullName', 'age', 'sex', 'address', 'course', 'email', 'password'];
  const emptyField = requiredFields.find((field) => !String(values[field] || '').trim());

  if (emptyField) {
    return 'Please complete all fields.';
  }

  if (!isValidEmail(values.email)) {
    return 'Please enter a valid email address.';
  }

  if (Number.isNaN(Number(values.age)) || Number(values.age) < 15 || Number(values.age) > 80) {
    return 'Please enter a valid age.';
  }

  if (values.password.length < 6) {
    return 'Password must be at least 6 characters.';
  }

  return '';
}

export function validateProfile(values) {
  const requiredFields = ['fullName', 'age', 'sex', 'address', 'course'];
  const emptyField = requiredFields.find((field) => !String(values[field] || '').trim());

  if (emptyField) {
    return 'Please complete all profile fields.';
  }

  if (Number.isNaN(Number(values.age)) || Number(values.age) < 15 || Number(values.age) > 80) {
    return 'Please enter a valid age.';
  }

  return '';
}