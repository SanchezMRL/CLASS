import { useState, useEffect } from 'react';
import { scheduleService } from '../services/scheduleService';

export const useSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [nextClasses, setNextClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const data = await scheduleService.getSchedule();
        setSchedule(data);
        
        // Obtener próximas clases (próximos 7 días)
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        
        const upcoming = data.filter(item => {
          const classDate = new Date(item.date);
          return classDate >= today && classDate <= nextWeek;
        }).sort((a, b) => new Date(a.date) - new Date(b.date));
        
        setNextClasses(upcoming);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const addScheduleItem = async (itemData) => {
    try {
      const newItem = await scheduleService.createScheduleItem(itemData);
      setSchedule([...schedule, newItem]);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const updateScheduleItem = async (id, itemData) => {
    try {
      const updatedItem = await scheduleService.updateScheduleItem(id, itemData);
      setSchedule(schedule.map(item => 
        item.id === id ? updatedItem : item
      ));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const deleteScheduleItem = async (id) => {
    try {
      await scheduleService.deleteScheduleItem(id);
      setSchedule(schedule.filter(item => item.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  return {
    schedule,
    nextClasses,
    loading,
    error,
    addScheduleItem,
    updateScheduleItem,
    deleteScheduleItem
  };
};