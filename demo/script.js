let token = localStorage.getItem("token")

const main = document.getElementById("main")
const loginForm = document.getElementById("loginForm")

document.getElementById("btnLogin").addEventListener("click", getToken)

if (token == null)
{
   main.classList.add("hidden")
   loginForm.classList.remove("hidden")
} else
{
   loginForm.classList.add("hidden")
   main.classList.remove("hidden")
   setTimeout(updateToken, 3000)
}

function getToken()
{
   const myHeaders = new Headers();
   myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

   const urlencoded = new URLSearchParams();
   urlencoded.append("client_id", "sirius-frontend");
   urlencoded.append("grant_type", "password");
   urlencoded.append("username", document.getElementById("username").value);
   urlencoded.append("password", document.getElementById("password").value);

   document.getElementById("password").value = ""

   const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded
   };

   fetch("http://localhost:7070/realms/sirius/protocol/openid-connect/token", requestOptions)
      .then((response) =>
         response.ok ? response.json() : new Error("auth error")
      )
      .then((result) =>
      {
         localStorage.setItem("token", JSON.stringify(result))
         setTimeout(updateToken, (result.expires_in - 5) * 1000)

         loginForm.classList.add("hidden")
         main.classList.remove("hidden")


      })
      .catch((error) => console.error(error));
}

function updateToken()
{
   let tkn = localStorage.getItem("token")

   if (tkn == null)
   {
      console.error("no stored token")
      return
   }

   let token = JSON.parse(tkn)

   if (token.refresh_token == undefined)
   {
      return
   }

   const myHeaders = new Headers();
   myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

   const urlencoded = new URLSearchParams();
   urlencoded.append("client_id", "sirius-frontend");
   urlencoded.append("grant_type", "refresh_token");
   urlencoded.append("refresh_token", token.refresh_token);

   const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
   };

   fetch("http://localhost:7070/realms/sirius/protocol/openid-connect/token", requestOptions)
      .then((response) => response.json())
      .then((result) =>
      {
         localStorage.setItem("token", JSON.stringify(result))
         setTimeout(updateToken, (result.expires_in - 5) * 1000)

         loginForm.classList.add("hidden")
         main.classList.remove("hidden")


      })
      .catch((error) => console.error(error));
}