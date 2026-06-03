import Joi from "joi";
export const validateCreateConversation = (req,res,next) => {
  const schema = Joi.object({
    title: Joi.string().max(255).optional(),
    isGroup: Joi.boolean().optional(),
    chatType: Joi.string().valid("DIRECT","GROUP").optional(),
  });
  const { error } = schema.validate(req.body, { abortEarly:false });
  if (error) return res.status(422).json({ errors: error.details });
  next();
};