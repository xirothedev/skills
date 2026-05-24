// INCORRECT: Internal details leak to clients and the shape is unstable.
throw new Error(`Failed to update ${email}: ${dbError.message}`);
