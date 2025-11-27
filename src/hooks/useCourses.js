import { useState, useEffect } from 'react';
import { courseService } from '../services/courseService';

export const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await courseService.getAllCourses();
        setCourses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const addCourse = async (courseData) => {
    try {
      const newCourse = await courseService.createCourse(courseData);
      setCourses([...courses, newCourse]);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const updateCourse = async (id, courseData) => {
    try {
      const updatedCourse = await courseService.updateCourse(id, courseData);
      setCourses(courses.map(course => 
        course.id === id ? updatedCourse : course
      ));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const deleteCourse = async (id) => {
    try {
      await courseService.deleteCourse(id);
      setCourses(courses.filter(course => course.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  return {
    courses,
    loading,
    error,
    addCourse,
    updateCourse,
    deleteCourse
  };
};