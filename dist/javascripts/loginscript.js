// login backend redirect
// Select the form element
const loginForm = document.querySelector("form")

// Add a submit event listener to the login form
loginForm.addEventListener("submit", async (e) => {
     e.preventDefault() // Prevent the form from reloading the page

     // Get the email and password values from the form
     const email = document.querySelector("#email").value
     const password = document.querySelector("#password").value

     try {
          const response = await fetch("/auth/login", {
               method: "POST",
               headers: {
                    "Content-Type": "application/json",
               },
               body: JSON.stringify({ email, password }),
          })

          if (response.ok) {
               // Redirect to the dashboard or another page on successful login
               window.location.href = "/dashboard"
          } else {
               // Handle errors and display a message to the user
               const errorData = await response.json()
               alert(errorData.message || "Login failed. Please try again.")
          }
     } catch (err) {
          console.error("Error:", err)
          alert("An error occurred. Please try again later.")
     }
})
