function isBlankOrNull(value) {
	return value == null || String(value).trim().equals(String('')) || String(value).trim().equals(String('null'));
}