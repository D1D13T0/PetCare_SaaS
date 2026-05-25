export const isValidCNPJ = (cnpj: string): boolean => {
	const clean = cnpj.replace(/\D/g, '');

	if (clean.length !== 14) return false;
	if (/^(\d)\1+$/.test(clean)) return false;

	const calcDigit = (base: string, weights: number[]) => {
		const sum = base.split('').reduce((acc, d, i) => acc + Number(d) * weights[i], 0);
		const rem = sum % 11;
		return rem < 2 ? 0 : 11 - rem;
	};

	const d1 = calcDigit(clean.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
	if (d1 !== Number(clean[12])) return false;

	const d2 = calcDigit(clean.slice(0, 13), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
	if (d2 !== Number(clean[13])) return false;

	return true;
};
