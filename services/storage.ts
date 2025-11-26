import { Deadline } from '../types';

const STORAGE_KEY = 'judicial_deadlines_data_v1';

export const getDeadlines = (): Deadline[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    // Sort by targetDate ascending (closest first)
    const parsed: Deadline[] = JSON.parse(stored);
    return parsed.sort((a, b) => a.targetDate - b.targetDate);
  } catch (error) {
    console.error("Error loading from local storage", error);
    return [];
  }
};

const saveToStorage = (deadlines: Deadline[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deadlines));
  } catch (error) {
    console.error("Error saving to local storage", error);
    alert("حدث خطأ أثناء حفظ البيانات (قد تكون المساحة ممتلئة)");
  }
};

export const addDeadline = async (deadlineData: Omit<Deadline, 'id'>): Promise<Deadline> => {
  const deadlines = getDeadlines();
  
  const newDeadline: Deadline = {
    ...deadlineData,
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString() + Math.random().toString(),
  };
  
  deadlines.push(newDeadline);
  saveToStorage(deadlines);
  return newDeadline;
};

export const updateDeadline = async (id: string, data: Partial<Deadline>) => {
  const deadlines = getDeadlines();
  const index = deadlines.findIndex(d => d.id === id);
  
  if (index !== -1) {
    deadlines[index] = { ...deadlines[index], ...data };
    saveToStorage(deadlines);
  }
};

export const deleteDeadline = async (id: string) => {
  const deadlines = getDeadlines();
  const filtered = deadlines.filter(d => d.id !== id);
  saveToStorage(filtered);
};
