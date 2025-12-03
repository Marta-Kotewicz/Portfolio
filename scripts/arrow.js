const sdContainer = document.getElementById('sd-container');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY || window.pageYOffset;
  const windowHeight = window.innerHeight;
  const docHeight = document.documentElement.scrollHeight;

  if (scrollTop + windowHeight >= docHeight -200) {
    sdContainer.style.display = 'none';
  } else {
    sdContainer.style.display = 'block';
  }
});