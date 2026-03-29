export function validateCombination({ exterior, wheel, roof, interior }) {
  if (!exterior || !wheel || !roof || !interior) {
    return {
      ok: false,
      error: 'Please choose an option for exterior, wheels, roof, and interior.',
    }
  }
  if (roof.name === 'Soft top' && wheel.name === 'Racing') {
    return {
      ok: false,
      error: 'Racing wheels are not available with a soft top for structural and clearance reasons.',
    }
  }
  return { ok: true }
}
