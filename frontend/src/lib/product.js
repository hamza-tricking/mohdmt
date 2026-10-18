// اللون الافتراضي للمنتج (الذي يحدده المدير)، وإلا أول لون متوفر.
export function defaultColorOf(product) {
  return product.colors.find((c) => c.name === product.defaultColor) || product.colors[0];
}
