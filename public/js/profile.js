const newFormHandler = async (event) => {
  event.preventDefault();

  const name = document.querySelector('#movie-name').value.trim();
  const publish_year = document.querySelector('#movie-year').value.trim();
  const movie_genre = document.querySelector('#movie-genre').value.trim();
  const movie_rating = document.querySelector('#movie-mpaa').value.trim();
  const description = document.querySelector('#movie-desc').value.trim();

  if (name && publish_year && description) {
    const response = await fetch(`/api/projects`, {
      method: 'POST',
      body: JSON.stringify({ name, publish_year, movie_genre, movie_rating, description }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to create project');
    }
  }
};

const delButtonHandler = async (event) => {
  if (event.target.hasAttribute('data-id')) {
    const id = event.target.getAttribute('data-id');

    const response = await fetch(`/api/movies/${movie_id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to delete MOVIE');
    }
  }
};

document
  .querySelector('.new-movie-form')
  .addEventListener('submit', newFormHandler);

document
  .querySelector('.movie-list')
  .addEventListener('click', delButtonHandler);