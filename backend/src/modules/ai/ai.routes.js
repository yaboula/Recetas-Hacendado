const router = require('express').Router();
const multer = require('multer');
const auth = require('../../middleware/auth.middleware');
const validate = require('../../middleware/validate.middleware');
const controller = require('./ai.controller');
const { mealAssistantSchema, weeklyPlanSchema, scanPantrySchema, cookingModeSchema } = require('./ai.schemas');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB — límite de Groq free tier
});

router.use(auth);

router.post('/meal-assistant', validate(mealAssistantSchema), controller.getMealAssistant);
router.post('/weekly-plan', validate(weeklyPlanSchema), controller.getWeeklyPlan);
router.post('/scan-pantry', validate(scanPantrySchema), controller.scanPantry);
router.post('/cooking-mode', validate(cookingModeSchema), controller.getCookingMode);
router.post('/transcribe-audio', upload.single('audio'), controller.transcribeAudio);

module.exports = router;
