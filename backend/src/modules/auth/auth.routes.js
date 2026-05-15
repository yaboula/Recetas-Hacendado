const router   = require('express').Router();
const Joi      = require('joi');
const ctrl     = require('./auth.controller');
const validate = require('../../middleware/validate.middleware');
const auth     = require('../../middleware/auth.middleware');

// ── Schemas de validación ──────────────────────────────────────
const registerSchema = Joi.object({
  email:    Joi.string().email().required().messages({
    'string.email': 'El email no tiene un formato válido.',
    'any.required': 'El email es obligatorio.',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'La contraseña debe tener al menos 8 caracteres.',
    'any.required': 'La contraseña es obligatoria.',
  }),
  nombre: Joi.string().max(100).optional(),
});

const loginSchema = Joi.object({
  email:    Joi.string().email().required(),
  password: Joi.string().required(),
});

const prefsSchema = Joi.object({
  preferencias: Joi.array()
    .items(Joi.string().valid('VEGANO', 'VEGETARIANO', 'SIN_GLUTEN', 'SIN_LACTOSA', 'SIN_HUEVO'))
    .required()
    .messages({ 'any.required': 'El campo preferencias es obligatorio.' }),
});

const updatePerfilSchema = Joi.object({
  nombre: Joi.string().max(100).allow(null, ''),
  email: Joi.string().email(),
}).min(1);

const changePasswordSchema = Joi.object({
  current_password: Joi.string().required().messages({ 'any.required': 'La contraseña actual es obligatoria.' }),
  new_password: Joi.string().min(8).required().messages({ 'string.min': 'La nueva contraseña debe tener al menos 8 caracteres.' }),
});

// ── Rutas públicas ─────────────────────────────────────────────
router.post('/register', validate(registerSchema), ctrl.register);
router.post('/login',    validate(loginSchema),    ctrl.login);

// ── Rutas protegidas (requieren JWT) ───────────────────────────
router.post('/logout',         auth, ctrl.logout);
router.get('/me',              auth, ctrl.getMe);
router.put('/preferencias',    auth, validate(prefsSchema), ctrl.updatePreferencias);
router.put('/perfil',          auth, validate(updatePerfilSchema), ctrl.updatePerfil);
router.put('/password',        auth, validate(changePasswordSchema), ctrl.changePassword);
router.get('/perfil/stats',    auth, ctrl.getProfileStats);

module.exports = router;
