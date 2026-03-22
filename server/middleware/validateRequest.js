module.exports = (schema) => (req, res, next) => {
	if (!schema) {
		return next();
	}

	try {
		if (typeof schema.safeParse === 'function') {
			const result = schema.safeParse(req.body);
			if (!result.success) {
				return res.status(400).json({ message: 'Invalid request', errors: result.error.errors });
			}
			req.body = result.data;
			return next();
		}

		if (typeof schema.validate === 'function') {
			const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
			if (error) {
				return res.status(400).json({ message: 'Invalid request', errors: error.details });
			}
			req.body = value;
			return next();
		}

		return next();
	} catch (err) {
		return res.status(400).json({ message: 'Invalid request' });
	}
};
