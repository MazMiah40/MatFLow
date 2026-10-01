import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const STORAGE_KEY = 'matflow_timetable_data';

export const getTimetableData = async (userId = 'guest') => {
  try {
    if (!userId || userId === 'guest') {
      const localData = localStorage.getItem(STORAGE_KEY);
      return localData ? JSON.parse(localData) : {};
    }
    const docRef = doc(db, 'timetables', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return {};
  } catch (error) {
    console.error('Error fetching timetable:', error);
    const localData = localStorage.getItem(STORAGE_KEY);
    return localData ? JSON.parse(localData) : {};
  }
};

export const saveProgrammeToSlot = async (slotKey, programmeData, userId = 'guest') => {
  try {
    const currentData = await getTimetableData(userId);
    const updatedData = { ...currentData, [slotKey]: programmeData };

    if (!userId || userId === 'guest') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      return updatedData;
    }

    const docRef = doc(db, 'timetables', userId);
    await setDoc(docRef, updatedData, { merge: true });
    return updatedData;
  } catch (error) {
    console.error('Error saving slot programme:', error);
    const currentData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    currentData[slotKey] = programmeData;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
    return currentData;
  }
};

export const removeProgrammeFromSlot = async (slotKey, userId = 'guest') => {
  try {
    const currentData = await getTimetableData(userId);
    delete currentData[slotKey];

    if (!userId || userId === 'guest') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
      return currentData;
    }

    const docRef = doc(db, 'timetables', userId);
    await setDoc(docRef, currentData);
    return currentData;
  } catch (error) {
    console.error('Error removing slot programme:', error);
    const currentData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    delete currentData[slotKey];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
    return currentData;
  }
};
