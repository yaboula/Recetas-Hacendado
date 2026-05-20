import client from './client';

export const getMealAssistant = (data) => client.post('/ai/meal-assistant', data).then((r) => r.data);
export const getWeeklyPlan = (data) => client.post('/ai/weekly-plan', data).then((r) => r.data);
export const scanPantry = (data) => client.post('/ai/scan-pantry', data).then((r) => r.data);
export const getCookingMode = (data) => client.post('/ai/cooking-mode', data).then((r) => r.data);
