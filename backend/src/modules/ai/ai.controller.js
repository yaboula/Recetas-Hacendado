     const aiService = require('./ai.service');

async function getMealAssistant(req, res, next) {
  try {
    const response = await aiService.getMealAssistantResponse(req.body);
    res.json(response);
  } catch (err) {
    next(err);
  }
}

async function getWeeklyPlan(req, res, next) {
  try {
    const response = await aiService.getWeeklyPlan(req.body);
    res.json(response);
  } catch (err) {
    next(err);
  }
}

async function scanPantry(req, res, next) {
  try {
    const response = await aiService.scanPantry(req.body);
    res.json(response);
  } catch (err) {
    next(err);
  }
}

async function getCookingMode(req, res, next) {
  try {
    const response = await aiService.getCookingMode(req.body);
    res.json(response);
  } catch (err) {
    next(err);
  }
}

async function transcribeAudio(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha recibido ningún archivo de audio.' });
    }

    const response = await aiService.transcribeAudio({
      audioBuffer: req.file.buffer,
      mimeType: req.file.mimetype || 'audio/webm',
      language: req.body?.language || 'es',
    });
    res.json(response);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMealAssistant,
  getWeeklyPlan,
  scanPantry,
  getCookingMode,
  transcribeAudio,
};
