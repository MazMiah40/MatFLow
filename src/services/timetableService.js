import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';

// Collection reference
const getTimetableRef = (userId) => collection(db, 'users', userId, 'timetable');

// Fetch all scheduled classes
export async function getTimetableClasses(userId) {
  if (!userId || userId === 'guest-user') {
    // Return sample demo schedule for guest mode
    return [
      { id: 't1', discipline: 'BJJ (Gi)', dayOfWeek: 'Tuesday', time: '12:00 PM', activePlanId: null },
      { id: 't2', discipline: 'No-Gi Grappling', dayOfWeek: 'Tuesday', time: '6:30 PM', activePlanId: null },
      { id: 't3', discipline: 'MMA', dayOfWeek: 'Wednesday', time: '6:00 PM', activePlanId: null },
      { id: 't4', discipline: 'Kickboxing', dayOfWeek: 'Thursday', time: '7:00 PM', activePlanId: null },
      { id: 't5', discipline: 'Junior BJJ', dayOfWeek: 'Saturday', time: '10:00 AM', activePlanId: null }
    ];
  }

  const snapshot = await getDocs(getTimetableRef(userId));
  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data()
  }));
}

// Add a new recurring class
export async function createTimetableClass(userId, classData) {
  if (!userId || userId === 'guest-user') {
    return 'guest-class-' + Date.now();
  }

  const docRef = await addDoc(getTimetableRef(userId), {
    ...classData,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

// Update class details or assign a curriculum plan to a class
export async function updateTimetableClass(userId, classId, updatedData) {
  if (!userId || userId === 'guest-user') return;
  const classRef = doc(db, 'users', userId, 'timetable', classId);
  await updateDoc(classRef, updatedData);
}

// Delete a class
export async function deleteTimetableClass(userId, classId) {
  if (!userId || userId === 'guest-user') return;
  const classRef = doc(db, 'users', userId, 'timetable', classId);
  await deleteDoc(classRef);
}
