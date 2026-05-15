const Joi = require('joi');

// Devuelve un middleware que valida req.body contra el schema Joi dado
function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });

    if (error) {
      const detalles = error.details.map((d) => d.message);
      return res.status(400).json({
        error: 'Datos de entrada inválidos.',
        code: 'VALIDATION_ERROR',
        detalles,
      });
    }

    req.body = value; // usa el valor validado y limpio
    next();
  };
}

module.exports = validate;
