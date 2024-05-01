
import { user } from "./user.js";
import { score } from "./score.js";

function displayRegisterUserError(errorMessage) {
  const errorSection = document.getElementById('userRegisterError');
  errorSection.textContent = errorMessage;
}
function displayLoginUserError(errorMessage) {
  const errorSection = document.getElementById('userLoginError');
  errorSection.textContent = errorMessage;
}

const registerForm = document.getElementById("register-form");

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const pseudoInput = document.getElementById("text");
  const passwordInput = document.getElementById("password");

  if (pseudoInput.value.trim() === '' || passwordInput.value.trim() === '') {
    displayRegisterUserError("Veuillez remplir tous les champs.");
    return;
  }

  try {
    const response = await user.auth.register(pseudoInput.value, passwordInput.value);
    if (response.error) {
      displayRegisterUserError(response.error); // Affichez l'erreur renvoyée par le backend
    } else {
      console.log("Inscription réussie:", response);
    }
  } catch (error) {
    console.error("Registration error:", error);
    displayRegisterUserError(error.message);
  }
});

const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const pseudoInput = document.getElementById("login-text");
  const passwordInput = document.getElementById("login-password");

  if (pseudoInput.value.trim() === '' || passwordInput.value.trim() === '') {
    displayLoginUserError("Veuillez remplir tous les champs.");
    return;
  }

  try {
    const data = await user.auth.login(pseudoInput.value, passwordInput.value);
    if (data.error) {
      console.error('Login error:', data.error);
      displayLoginUserError('Échec de la connexion: ' + data.error);
    } else {
      console.log('Connexion réussie');
      console.log('Utilisateur connecté:', data);
      initUser()
    }
  } catch (error) {
    console.error('Erreur lors de la connexion utilisateur', error);
    displayLoginUserError('Échec de la connexion: ' + error.message);
  }
});

const logout = document.getElementById("logout");
logout.addEventListener("click", async (event) => {
  event.preventDefault();
  try {
    const data = await user.auth.logout();
    if (data.error) {
      console.error('Logout error:', data.error);
    } else {
      console.log('Déconnexion réussie');
      console.log('Utilisateur déconnecté:', data);
      initUser()
    }
  } catch (error) {
    console.error('Erreur lors de la déconnexion utilisateur', error);
  }
});

document.addEventListener("DOMContentLoaded", async (event) => {
  const board = document.getElementById("data-score");
  try {
    const data = await score.board.getScores();

    if (data.error) {
      console.error('Scores error:', data.error);
    }

    board.innerHTML = '';

    data.forEach((user, index) => {
      const listItem = document.createElement('tr');
      listItem.classList.add('score-item');

      let emoji = '';
      if (index === 0) {
        emoji = '🥇';
      } else if (index === 1) {
        emoji = '🥈';
      } else if (index === 2) {
        emoji = '🥉';
      }

      listItem.innerHTML = `
                <td class="txt__label">${emoji}${index + 1} - ${user.pseudo}</td>
                <td class="txt__number">${user.bestscore}</td>
            `;
      board.appendChild(listItem);
    });


  } catch (error) {
    console.error('Erreur lors de la récupération des scores', error);
  }
});

async function initUser() {
  const profil = document.getElementById("data-user");
  try {
    const data = await user.auth.getUser();
    if (data) {
      profil.innerHTML = `
                  <li class="position">${data.pseudo}</li>
                  <li class="username">${data.bestscore}</li>
              `;
      showUserProfile()
    }
  } catch (error) {
    profil.innerHTML = '';
    showUserForm()
  }
}
initUser()




function showUserForm() {
  const userForm = document.querySelector('.header--userForm');
  const userProfile = document.querySelector('.header--userProfile');
  if (!userForm.classList.contains('active')) {
      userForm.classList.add('active');
      userProfile.classList.remove('active');
  }
}
function showUserProfile() {
  const userForm = document.querySelector('.header--userForm');
  const userProfile = document.querySelector('.header--userProfile');
  if (!userProfile.classList.contains('active')) {
      userProfile.classList.add('active');
      userForm.classList.remove('active');
  }
}


export async function setScore(newScore) {
  try {
    const data = await score.board.setScore(newScore);
    if (data.error) {
      console.error('Update score error:', data.error);
    } else {
      console.log('Score modifié:', data);
      initUser()
    }
  } catch (error) {
    console.error('Échec de la modification du score', error);
  }
}

// const addScore = document.getElementById("add-score");
// addScore.addEventListener("submit", async (event) => {
//   event.preventDefault();
//   try {
//     const scoreValue = document.getElementById("value-score");
//     console.log(scoreValue.value)
//     const data = await score.board.setScore(scoreValue.value);
//     if (data.error) {
//       console.error('Update score error:', data.error);
//     } else {
//       console.log('Score modifié:', data);
//       initUser()
//     }
//   } catch (error) {
//     console.error('Échec de la modification du score', error);
//   }
// });
