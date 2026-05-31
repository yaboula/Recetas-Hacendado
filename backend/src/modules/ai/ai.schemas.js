const Joi = require('joi');

const preferenciasSchema = Joi.array()
  .items(Joi.string().trim().uppercase().valid('VEGANO', 'VEGETARIANO', 'SIN_GLUTEN', 'SIN_LACTOSA', 'SIN_HUEVO'))
  .max(5)
  .default([]);

const mealAssistantSchema = Joi.object({
  prompt: Joi.string().trim().min(8).max(1000).required(),
  preferencias: preferenciasSchema,
  maxRecetas: Joi.number().integer().min(1).max(8).default(4),
});

const weeklyPlanSchema = Joi.object({
  objetivo: Joi.string().trim().min(8).max(1000).required(),
  preferencias: preferenciasSchema,
  dias: Joi.number().integer().min(3).max(7).default(7),
});

const scanPantrySchema = Joi.object({
  imageBase64: Joi.string().min(100).max(12_000_000).required(),
  preferencias: preferenciasSchema,
});

const cookingModeSchema = Joi.object({
  recetaId: Joi.string().guid({ version: ['uuidv4', 'uuidv5'] }).required(),
  raciones: Joi.number().integer().min(1).max(12).default(2),
});

module.exports = {
  mealAssistantSchema,
  weeklyPlanSchema,
  scanPantrySchema,
  cookingModeSchema,
};
