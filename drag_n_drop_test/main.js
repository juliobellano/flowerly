const container = document.getElementById("container")

const originalFlower = document.getElementById("original-flower")

function createFlower(x, y) {
     const flower = document.createElement("div")
     flower.classList.add("flower")
     flower.textContent = "Flower"

     flower.style.position = "absolute"
     flower.style.left = x + "px"
     flower.style.top = y + "px"

     let newX = 0,
          newY = 0,
          startX = 0,
          startY = 0

     flower.addEventListener("mousedown", (e) => {
          startX = e.clientX
          startY = e.clientY

          document.addEventListener("mousemove", mouseMove)
          document.addEventListener("mouseup", mouseUp)
     })

     function mouseMove(e) {
          newX = startX - e.clientX
          newY = startY - e.clientY

          startX = e.clientX
          startY = e.clientY

          flower.style.top = flower.offsetTop - newY + "px"
          flower.style.left = flower.offsetLeft - newX + "px"
     }

     function mouseUp() {
          document.removeEventListener("mousemove", mouseMove)
     }

     container.appendChild(flower)
}

originalFlower.addEventListener("mousedown", (e) => {
     createFlower(originalFlower.offsetLeft, originalFlower.offsetTop)
})
