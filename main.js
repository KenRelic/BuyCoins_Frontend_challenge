"use strict";

const searchPage = document.getElementById("search-page");
const profileDisplayPage = document.getElementById("user-profile-page");
const searchButton = document.getElementById("search-profile-btn");
const spinner = document.querySelector("#form-spinner");
const searchButtonText = document.querySelector("#search-profile-btn > span");

const menuBarBtn = document.getElementById("mobile-menu-btn");
const mobileNavBar = document.getElementById("mobile-navbar");

const profilePageSearchLoader = document.querySelector(
  ".profile-page-search-loader"
);

const form = document.getElementById("search-form");
const errorPlaceholder = document.querySelector(".error-placeholder");
const popupError = document.querySelector(".profile-page-search-error");
const repoSection = document.querySelector("#repo-section");

const userFullName = document.querySelector(".user-fullname");
const userName = document.querySelector(".user-name");
const userBio = document.querySelector(".user-bio");
const totalRepo = document.querySelector("#repo-count");
const userImg = document.querySelector("#user-profile-image");
const userMobileIconName = document.querySelector("#mobile-user-name");
const desktopUserImageIcon = document.querySelector(".desktop-user-icon-img");
const mobileIUserImageIcon = document.querySelector("#mobile-user-icon-img");
const statusDesktop = document.querySelector(".desktop-user-status");
const statusMobile = document.querySelector(".mobile-user-status");
const searchResultTotal = document.querySelector(".query-result");

const desktopSearchBox = document.getElementById("desktop-search-input");
const desktopSearchButton = document.querySelector(
  ".desktop-navbar-search-btn"
);

const mobileSearchBox = document.getElementById("mobile-search-input");
const mobileSearchButton = document.querySelector(".mobile-navbar-search-btn");

function toggleNavBar() {
  mobileNavBar.classList.toggle("open");
}

function hideSearchHistory() {}

menuBarBtn.addEventListener("click", toggleNavBar);
desktopSearchBox.addEventListener("focus", () => console.log(";;"));
mobileSearchBox.addEventListener("focus", () => console.log("SUBMITTING..."));
form.addEventListener("submit", getProfileDetails);

mobileSearchButton.addEventListener("click", getProfileDetails);
desktopSearchButton.addEventListener("click", getProfileDetails);

async function getProfileDetails(e) {
  const history = searchHistory().get();
  if (history.length > 4) history.splice(0, 1);

  const searchOrigin = e.target.classList[0].split("-")[0];
  const searchBox = { mobile: mobileSearchBox, desktop: desktopSearchBox };

  let profileName = "";
  if (searchOrigin === "form") {
    hideError();
    e.preventDefault();
    profileName = form["user-username"].value;

    if (!profileName) {
      return showError("Please enter a github profile name");
    }

    searchHistory().set(profileName.trim());
    return displayUserDetails(await queryAPI(profileName.trim()));
  } else {
    profileName = searchBox[searchOrigin].value;
    if (!profileName) {
      return showError("Please enter a github profile name", "popup");
    }
    if (searchOrigin === "mobile") toggleNavBar();

    if (profileName.trim() === window.localStorage.getItem("noUser")) {
      return showError("The user doesn't exist on Github", "popup");
    }

    showProfilePageLoader();

    if (history[history.length - 1] !== profileName.trim()) {
      searchHistory().set(profileName.trim());
      displayUserDetails(await queryAPI(profileName.trim()));
    }

    setTimeout(() => hideProfilePageLoader(), 2000);
  }
}

function showProfilePageLoader() {
  profilePageSearchLoader.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function hideProfilePageLoader() {
  profilePageSearchLoader.style.display = "none";
  document.body.style.overflow = "unset";
}

function searchHistory() {
  let searchStore = [];
  if (window.localStorage.getItem("searchStore")) {
    searchStore = [...JSON.parse(window.localStorage.getItem("searchStore"))];
  } else {
    window.localStorage.setItem("searchStore", JSON.stringify(searchStore));
  }

  return {
    set: (value) => {
      searchStore.push(value);
      window.localStorage.setItem("searchStore", JSON.stringify(searchStore));
    },
    get: () => searchStore,
    getLastSearch: () => searchStore[searchStore.length - 1],
  };
}

function showError(message, type = "inline") {
  if (type === "popup") {
    popupError.textContent = message;
    popupError.style.animationPlayState = "running";
    setTimeout(() => (popupError.style.animationPlayState = "paused"), 3000);
  } else {
    spinner.style.display = "none";
    searchButtonText.style.display = "block";
    errorPlaceholder.style.display = "block";
    errorPlaceholder.textContent = message;
  }
  return false;
}

function hideError() {
  spinner.style.display = "block";
  searchButtonText.style.display = "none";
  errorPlaceholder.style.display = "none";
  errorPlaceholder.textContent = "-";
}

function displayUserDetails(data) {
  if (data.user) {
    const user = data.user;
    const {
      name,
      login,
      bio,
      avatarUrl,
      repositories: { nodes, totalCount },
      status,
    } = user;
    // console.log(name, bio, nodes);

    userFullName.textContent = name;
    userName.textContent = login;
    userMobileIconName.textContent = login;
    userBio.textContent = bio;
    userImg.src = avatarUrl;
    desktopUserImageIcon.src = avatarUrl;
    mobileIUserImageIcon.src = avatarUrl;
    totalRepo.textContent = totalCount;
    searchResultTotal.textContent = `${
      totalCount > 20 ? 20 : totalCount
    } Results for Public Repositories`;

    if (status) {
      statusDesktop.innerHTML = status ? status.emojiHTML : "";
      statusMobile.innerHTML = `${status ? status.emojiHTML : ""} ${
        status ? status.message : ""
      }`;
    } else {
      statusDesktop.style.display = "none";
      statusMobile.style.display = "none";
    }
    const allRepos = document.querySelector(".repos-div");

    if (allRepos) repoSection.removeChild(allRepos);

    const newRopsDiv = document.createElement("div");
    newRopsDiv.classList.add("repos-div");

    if (nodes.length) {
      nodes.map((repo) => {
        const {
          name,
          description,
          stargazerCount,
          updatedAt,
          forkCount,
          primaryLanguage,
        } = repo;

        const colorName = primaryLanguage ? primaryLanguage.color : "none";
        const languageName = primaryLanguage ? primaryLanguage.name : "";

        const date = new Date(updatedAt).toDateString().split(" ");

        // console.log(repo, name, updatedAt, primaryLanguage);
        const div = document.createElement("div");
        div.classList.add("user-repository");
        div.innerHTML = `<div class="repo-detail">
              <a href="#" class="repo-name">${name}</a>
              <p class="repo-description" style="display:${
                !description ? "none" : "unset"
              }">
                ${description}
              </p>
              <div class="repo-meta-data">
                <div class="language" style="display:${
                  !languageName ? "none" : "unset"
                }">
                  <div class="language-color" style="background:${colorName};"></div>
                  ${languageName}
                </div>
                <span class="repo-star"
                  ><i class="far fa-star"></i>&nbsp;${stargazerCount}</span
                >
                <span class="repo-fork"
                  ><i class="fas fa-code-branch"></i>&nbsp;${forkCount}</span
                >
                <span class="repo-date">Updated on ${date[2]}&nbsp;${
          date[1]
        }</span>
              </div>
            </div>
            <div class="github-star">
              <span class="repo-star"><i class="far fa-star"></i></span> Star
            </div>`;
        newRopsDiv.appendChild(div);
      });
      repoSection.appendChild(newRopsDiv);
      showRepoPage();
    } else {
      //no result found
      const noRepoDiv = document.createElement("div");
      noRepoDiv.innerHTML = `
        <p class="no-repo">No Repository found </p>
      `;
      newRopsDiv.appendChild(noRepoDiv);
      repoSection.appendChild(newRopsDiv);
    }
    setTimeout(() => hideProfilePageLoader(), 3000);
  } else {
    hideProfilePageLoader();
    hideError();

    const lastSearch = searchHistory().getLastSearch();
    window.localStorage.setItem("noUser", lastSearch);
    return showError("The user doesn't exist on Github", "popup");
  }
}

function showRepoPage() {
  searchPage.style.display = "none";
  profileDisplayPage.style.display = "unset";
}
async function queryAPI(profileName) {
  let callData;
  const query = `{
  user(login:"${profileName}"){
    name
    login
    bio 
    avatarUrl
    status{
      emojiHTML
      message
    }
    repositories(first:20){
      totalCount
      nodes{
        name 
        description
        updatedAt
        stargazerCount
        forkCount
        primaryLanguage{
          color
          name
        }
      }
    }
  }
}`;

  await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "",
    },
    body: JSON.stringify({
      query,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      callData = data.data;
    });

  return callData;
}
