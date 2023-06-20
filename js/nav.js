const menuIcon = document.getElementById('menu-icon');
const sidebar = document.querySelector('.sidebar');

menuIcon.addEventListener('click', () => {
  menuIcon.classList.toggle('active');
  sidebar.classList.toggle('active');
});
