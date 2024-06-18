fetch('https://saavn.dev/api/search/artists?query=Adele', {
  headers: {
    Authorization: 'Basic Ok5heWFubXVzaWM='
  }
})
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
