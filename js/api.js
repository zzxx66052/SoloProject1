const API_KEY = '0bf84436a682ffa0afb4f4ca20275250';
const API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=ko&page=1`;
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

const searchMoive = document.querySelector('#searchMovie');
const searchBtn = document.querySelector('#searchBtn');
const modal = document.querySelector('#modal');
const modalMain = document.querySelector('.modalMain');
const modalClose = document.querySelector('.close');
const headerTitle = document.querySelector('h1');
const movieList = document.querySelector('#movieList');
const movieList2 = document.querySelector('#movieList2');
const updatebookMark = document.querySelector('#bookMarkbtn');
const removebookMark = document.querySelector('#removebookMarkbtn');
const showBook = document.querySelector('#showBook');

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwYmY4NDQzNmE2ODJmZmEwYWZiNGY0Y2EyMDI3NTI1MCIsIm5iZiI6MTcyOTU5NTQyOS44MzkyMSwic3ViIjoiNjcwZjAwZjI3YTIyYmYzNjA3ZjI2ZWQyIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.faXY55W6bg-SOjoTgaCt5E28vCwmqIr1MYSVngO4qZU' // 여기에 본인의 API 키 입력
  }
};

// 빈 배열로 영화들을 선언
let movies = [];

// 인기있는영화 API를 비동기적으로 가공
async function fetchPopularMovies() {
  try {
    const response = await fetch(API_URL, options);
    const data = await response.json();
    movies = data.results; // movies 배열에 저장
    showMovie(movies);
  } catch (err) {
    console.error('Fetch에서 에러 발생', err);
  }
}

// 화면에 API값을 가져와서 인기있는 영화들을 카드에 순서대로 넣기
const showMovie = (movies) => {
  movieList.innerHTML = '';

  movies.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movieCard');
    movieCard.dataset.id = movie.id; // 영화 ID 저장
    movieCard.innerHTML = 
      `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <p>평점: ${movie.vote_average}</p>`;
    
    movieList.appendChild(movieCard);
  });
};

// 영화 카드 클릭 이벤트를 상위 요소에서 처리 (modal로 구현하기 위한 클릭이벤트)
movieList.addEventListener('click', (event) => {
  const movieCard = event.target.closest('.movieCard');
  if (movieCard) {
    const movieId = movieCard.dataset.id;
    const movie = movies.find(m => m.id === parseInt(movieId));
    openModal(movie);
  }
});

// 검색 버튼 클릭 이벤트(search버튼을 클릭했을때 검색이 되도록 하는 이벤트)
searchBtn.addEventListener('click', () => {
  const searchText = searchMoive.value.toLowerCase();
  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchText)
  );
  showMovie(filteredMovies);
});

// 실시간 검색 기능(filter를 이용해서 대소문자 구분없기 검색이 가능하게 만든 기능)
const filterMovies = (searchText) => {
  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchText.toLowerCase())
  );
  showMovie(filteredMovies);
};

// 검색창에 입력할 때마다 필터링
searchMoive.addEventListener('input', () => {
  const searchText = searchMoive.value;
  filterMovies(searchText);
});

// Enter 키로 검색 실행
searchMoive.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    const searchText = searchMoive.value;
    filterMovies(searchText);
  }
});

// 모달 열기 및 영화 세부정보 표시 함수(모달창 열렸을때 외부 스크롤 방지)
const openModal = (movie) => {
  const modalImg = modal.querySelector('#modalImg');
  const movieTitle = modal.querySelector('#movieTitle');
  const movieContent = modal.querySelector('#movieContent');
  const modalDate = modal.querySelector('#modalDate');
  const modalRating = modal.querySelector('#modalRating');

  modalMain.dataset.id = movie.id
  modalImg.src = IMAGE_URL + movie.poster_path;
  movieTitle.textContent = movie.title;
  movieContent.textContent = movie.overview;
  modalDate.textContent = movie.release_date;
  modalRating.textContent = movie.vote_average;

  modal.style.display = 'flex';
  isModalOpen = true;
  document.body.classList.add('no-scroll');
};

// 닫기 버튼 클릭 시 모달 닫기(모달창 닫히기 전까지 외부 스크롤 방지)
modalClose.addEventListener('click', () => {
  modal.style.display = 'none';
  isModalOpen = false;
  document.body.classList.remove('no-scroll');
});

// 모달창 외부 클릭 시 모달 닫기(모달이 닫히기 전까지 외부 스크롤 방지)
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
    isModalOpen = false;
    document.body.classList.remove('no-scroll');
  }
});

// 제목 클릭 시 메인으로 돌아가기
headerTitle.addEventListener('click', () => {
  searchMoive.value = '';
  showMovie(movies);
});

// 북마크 추가
const addBookmark = (movie) => {
  const bookmarks = localStorage.getItem('bookmarks') ? 
  JSON.parse(localStorage.getItem('bookmarks')) : [];

  // 중복 체크 후 추가
  if (!bookmarks.some(b => b.id === movie.id)) {
    bookmarks.push(movie); // 전체 영화 정보를 저장
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks)); // 문자열로 저장
    alert('북마크에 추가되었습니다!');
  } else {
    alert('이미 북마크에 추가된 영화입니다.');
  }
};

// 북마크 추가 클릭 이벤트
updatebookMark.addEventListener('click', () => {
  const movieId = parseInt(modalMain.dataset.id); //modalMain에서 영화 ID값 가져오기
  const movie = movies.find(m => m.id === movieId);

    if (movie) {
      const bookmark = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        overview: movie.overview,
        release_date: movie.release_date,
        vote_average: movie.vote_average
      };
      addBookmark(bookmark);
    } else {
      alert('영화 정보를 찾을 수 없습니다.');
  }
});


// 북마크 제거 
const removeBookmark = (id) => {
  let bookmarks = localStorage.getItem('bookmarks') ? JSON.parse(localStorage.getItem('bookmarks')) : [];
  // ID에 해당하는 북마크 제거
  bookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks)); // 업데이트된 목록 저장
};

// 북마크 삭제 클릭 이벤트
removebookMark.addEventListener('click', () => {
  const removeMovieId = parseInt(modalMain.dataset.id);

    if (removeMovieId) {
        removeBookmark(removeMovieId); // 영화 ID로 북마크 삭제
        alert('북마크가 삭제되었습니다!'); // 북마크 삭제 알람

        //모달창 닫기
        modal.style.display = 'none';
        isModalOpen = false;
        document.body.classList.remove('no-scroll');

        showBook.click(); // 북마크 목록 새로 고침
    } else {
        alert('해당 영화가 북마크에 없습니다.');
    }
});

// 북마크 조회
showBook.addEventListener('click', () => {
  const bookmarks = localStorage.getItem('bookmarks') ? JSON.parse(localStorage.getItem('bookmarks')) : [];
  if (bookmarks.length > 0) {
    movieList.innerHTML = '';

    bookmarks.forEach(movie => {
      const movieCard = document.createElement('div');
      movieCard.classList.add('movieCard');
      movieCard.dataset.id = movie.id;
      movieCard.innerHTML = 
      `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        <h3>${movie.title}</h3>
        <p>평점: ${movie.vote_average}</p>
        <button class="removeBookmarkBtn" data-title="${movie.id}">북마크삭제</button>`;
      movieList.appendChild(movieCard);
    });  
  } else {
    movieList.innerHTML = '<h3>북마크가 없습니다.</h3>';
  }
});

fetchPopularMovies();
