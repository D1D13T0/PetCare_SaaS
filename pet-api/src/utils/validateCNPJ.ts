import validator from "validator";

export const isValidCNPJ = (cnpj: string): boolean => {
	const clean = cnpj.replace(/\D/g, "");

	if (clean.length !== 14) return false;

	return validator.isTaxID(clean, "pt-BR");
};
