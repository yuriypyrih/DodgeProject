function calculateTotal(a, b) {
  const ok = '';
  const value = 10;
  const sum = a + b + value; // Place breakpoint here
  console.log('Sum is', sum);
  return sum;
}

document.getElementById('runBtn').addEventListener('click', () => {
  calculateTotal(5, 7);
});
