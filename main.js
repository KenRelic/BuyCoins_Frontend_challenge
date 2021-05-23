"use strict";

const searchPage = document.getElementById("search-page");
const profileDisplayPage = document.getElementById("user-profile-page");
const searchButton = document.getElementById("search-profile-btn");
const spinner = document.querySelector("#spinner");

const menuBarBtn = document.getElementById("mobile-menu-btn");
const mobileNavBar = document.getElementById("mobile-navbar");

const form = document.getElementById("search-form");
const errorPlaceholder = document.querySelector(".error-placeholder");
const repoSection = document.querySelector("#repo-section");

const userFullName = document.querySelector(".user-fullname");
const userName = document.querySelector(".user-name");
const userBio = document.querySelector(".user-bio");
const totalRepo = document.querySelector("#repo-count");
const userImg = document.querySelector("#user-profile-image");
const desktopUserImageIcon = document.querySelector(".desktop-user-icon-img");
const mobileIUserImageIcon = document.querySelector("#mobile-user-icon-img");
const statusDesktop = document.querySelector(".desktop-user-status");
const statusMobile = document.querySelector(".mobile-user-status");

function toggleNavBar() {
  mobileNavBar.classList.toggle("open");
}

menuBarBtn.addEventListener("click", toggleNavBar);
form.addEventListener("submit", getProfileDetails);

async function getProfileDetails(e) {
  e.preventDefault();
  hideError();

  const profileName = form["user-username"].value;
  if (!profileName) {
    showError("Please enter a github profile name");
  }
  displayUserDetails(await queryAPI(profileName));
}

function showError(message) {
  spinner.style.display = "none";

  errorPlaceholder.style.visibility = "visible";
  errorPlaceholder.textContent = message;
  return false;
}

function hideError() {
  spinner.style.display = "unset";
  errorPlaceholder.style.visibility = "hidden";
  errorPlaceholder.textContent = "-";
}

function displayUserDetails(data) {
  if (data.user) {
    const user = data.user;
    const {
      name,
      bio,
      avatarUrl,
      repositories: { nodes, totalCount },
      status: { emojiHTML, message },
    } = user;
    // console.log(name, bio, nodes);

    userFullName.textContent = name;
    userBio.textContent = bio;
    userImg.src = avatarUrl;
    desktopUserImageIcon.src = avatarUrl;
    mobileIUserImageIcon.src = avatarUrl;
    statusDesktop.innerHTML = emojiHTML;
    totalRepo.textContent = totalCount;
    statusMobile.innerHTML = `${emojiHTML} ${message}`;

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
                <span class="repo-date">Updated on ${updatedAt}</span>
              </div>
            </div>
            <div class="github-star">
              <span class="repo-star"><i class="far fa-star"></i></span> Star
            </div>`;
      repoSection.appendChild(div);
    });

    showRepoPage();
  } else {
    return showError("The user doesn't exist on Github");
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
