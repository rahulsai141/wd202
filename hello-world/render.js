const time = ms => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

const fetchUserDetails = async userID => {
  console.log('Fetch UserDetails');
  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve(`http://gmail.com/131${userID}`);
  //   }, 500);
  // });
  await time(500);
  return `http://gmail.com/131${userID}`;
};

const downloadImage = async imageURL => {
  console.log('Download Image');
  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve(`Image Data for ${imageURL}`);
  //   }, 500);
  // });
  await time(500);
  return `Image Data for ${imageURL}`;
};

const render = async image => {
  await time(500);
  console.log('Render Image');
};

// fetchUserDetails('john', imageURL => {
//   downloadImage(imageURL, image => {
//     render(image);
//   });
// });

// fetchUserDetails('john')
//   .then(imageURL => downloadImage(imageURL))
//   .then(image => render(image))
//   .catch(error => console.log('Error'));

const run = async () => {
  const imageURL = await fetchUserDetails('john');
  const image = await downloadImage(imageURL);
  await render(image);
};
run();
