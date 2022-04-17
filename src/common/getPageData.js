function getPageData(pageData) {
  const url = new URL(document.URL);
  const page = url.pathname.split("/")[1];
  switch (page) {
    case "storypoint":
      return pageData.storyPointPage;
    case "retro":
      return pageData.retroPage;
  }
}

export default getPageData;
