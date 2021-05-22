const menuBarBtn = document.getElementById("mobile-menu-btn");
const mobileNavBar = document.getElementById("mobile-navbar");

const form = document.getElementById("search-form");
const errorPlaceholder = document.querySelector(".error-placeholder");

function toggleNavBar() {
  mobileNavBar.classList.toggle("open");
}

menuBarBtn.addEventListener("click", toggleNavBar);
form.addEventListener("submit", getProfileDetails);

async function getProfileDetails(e) {
  e.preventDefault();
  const profileName = form["user-username"].value;
  if (!profileName) {
    errorPlaceholder.textContent = "Please enter a github profile name";
    errorPlaceholder.style.visibility = "unset";
    return false;
  }
  await queryAPI(profileName);

  console.log("JUMPED QUERY CALL", profileName);
}

async function queryAPI(profileName) {
  const query = `{
  user(login:"${profileName}"){
    name
    bio 
    avatarUrl
    status{
      emojiHTML
    }
    repositories(first:20){
      nodes{
        name 
        description
        updatedAt
        stargazerCount
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
      Authorization: "Bearer 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",
    },
    body: JSON.stringify({
      query,
      // variables: {
      //   _id,
      //   authorId,
      // },
    }),
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
}
// {
// user(login: "kenrelic") {
//   avatarUrl
//   bio
//   repositories(first: 20) {
//     edges {
//       node {
//         primaryLanguage {
//           color
//           name
//         }
//         updatedAt
//         forkCount
//         description
//         name
//         stargazerCount

//       }
//     }
//   }
// }
// }
