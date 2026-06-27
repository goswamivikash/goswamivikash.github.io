function toggleTheme() {
  document.body.classList.toggle("light");
}

function downloadResume() {
  const link = document.createElement("a");
  link.href = "data:text/plain;charset=utf-8,Vikash Goswami Resume";
  link.download = "Vikash_Goswami_Resume.txt";
  link.click();
}
