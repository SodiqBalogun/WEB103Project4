export function calcTotalPrice(exterior, wheel, roof, interior) {
  let total = 0
  for (const part of [exterior, wheel, roof, interior]) {
    if (part && part.price != null) total += Number(part.price)
  }
  return total
}
