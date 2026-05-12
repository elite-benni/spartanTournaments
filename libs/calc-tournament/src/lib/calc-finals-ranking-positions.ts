export function calcFinalistPositions(finalistCount: number): number[] {
  const finalRounds = Math.log2(finalistCount);
  const out: number[] = [];
  out[0] = 1;
  out[1] = 2;
  for (let fr = 1; fr < finalRounds; fr++) {
    const halfSlice = Math.pow(2, fr);
    for (let i = 0; i < halfSlice; i++) {
      out[i + halfSlice] = out[halfSlice - i - 1];
    }
    for (let i = 0; i < Math.pow(2, fr + 1); i++) {
      out[i] = out[i] * 2;
      if ((i + 1) % 2 === 1) {
        out[i]--;
      }
    }
  }
  return out;
}
