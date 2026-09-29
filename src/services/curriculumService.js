import { db } from '../firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';

// Get user's curriculum collection reference
const getCurriculumRef = (userId) => collection(db, 'users', userId, 'plans');

// Create a new curriculum plan
export async function createCurriculum(userId, planData) {
  if (!userId || userId === 'guest-user') {
    // Return mock ID for guest mode
    return { id: 'guest-plan-' + Date.now(), ...planData, createdAt: new Date() };
  }
  
  const docRef = await addDoc(getCurriculumRef(userId), {
    ...planData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  
  return docRef.id;
}

// Fetch all plans for the current user
export async function getUserCurriculums(userId) {
  if (!userId || userId === 'guest-user') {
    return [];
  }

  const querySnapshot = await getDocs(getCurriculumRef(userId));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

// Update an existing plan
export async function updateCurriculum(userId, planId, updatedData) {
  if (!userId || userId === 'guest-user') return;

  const planRef = doc(db, 'users', userId, 'plans', planId);
  await updateDoc(planRef, {
    ...updatedData,
    updatedAt: serverTimestamp()
  });
}

// Delete a plan
export async function deleteCurriculum(userId, planId) {
  if (!userId || userId === 'guest-user') return;

  const planRef = doc(db, 'users', userId, 'plans', planId);
  await deleteDoc(planRef);
}
