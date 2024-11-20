class Star {
    constructor(x, y, radius, speed) {
      this.x = x
      this.y = y
      this.radius = radius
      this.speed = speed
      this.angle = Math.random() * Math.PI * 2
      this.vx = Math.cos(this.angle) * this.speed
      this.vy = Math.sin(this.angle) * this.speed
    }
  
    update(clickX, clickY, isClicking) {
      if (isClicking) {
        const dx = this.x - clickX
        const dy = this.y - clickY
        const distance = Math.sqrt(dx * dx + dy * dy)
        const force = Math.min(50 / (distance * distance), 0.5)
        const angle = Math.atan2(dy, dx) + Math.PI / 2 // Perpendicular angle for circular motion
  
        // Circular vortex motion
        this.vx += Math.cos(angle) * force - dx * force * 0.2
        this.vy += Math.sin(angle) * force - dy * force * 0.2
  
        // Limit maximum speed during vortex
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy)
        if (speed > 9) {
          this.vx = (this.vx / speed) * 6
          this.vy = (this.vy / speed) * 6
        }
      } else {
        // Slowly return to random motion
        this.vx += (Math.cos(this.angle) * this.speed - this.vx) * 0.1
        this.vy += (Math.sin(this.angle) * this.speed - this.vy) * 0.1
      }
  
      this.x += this.vx
      this.y += this.vy
  
      // Wrap around screen edges
      if (this.x < 0) this.x = canvas.width
      if (this.x > canvas.width) this.x = 0
      if (this.y < 0) this.y = canvas.height
      if (this.y > canvas.height) this.y = 0
    }
  
    draw(ctx) {
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
      ctx.fillStyle = "white"
      ctx.fill()
    }
  }
  
  // create canvas  (bikin canvas backgroundnya)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  document.body.appendChild(canvas)

  let clickX = null;
  let clickY = null;
  let isClicking = false;
  
  // trying to make the canvas change according to the window size
function setCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}


//Start stars background (mulai gambar bintang)
function generateStars(){
  stars.length = 0;
  //dynamically generate the number of the stars according to the canvas size
  const starCount = Math.ceil(canvas.width * canvas.height / 500); 

  for (let i = 0; i < starCount; i++) {
    const x = Math.random() * canvas.width
    const y = Math.random() * canvas.height
    const radius = Math.random() * 0.5 + 0.1
    const speed = Math.random() * 0.1 + 0.07
    stars.push(new Star(x, y, radius, speed))
  }
}

 //initialize canvas size
setCanvasSize();
const stars = [];
generateStars();

  //animation loop
  function animate() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  
    stars.forEach((star) => {
      star.update(clickX, clickY, isClicking)
      star.draw(ctx)
    })
  
    requestAnimationFrame(animate)
  }
  
  animate()
  
  //resize the canvas according to the window size
  window.addEventListener("resize", () => {
    setCanvasSize();
    generateStars(); // testing to generate the stars again on resize
  })
  


  window.addEventListener("scroll", function() {
    const title = document.getElementById("jjb-team");
    const scrollPosition = window.scrollY; // Current scroll position
  
    if (scrollPosition > 50) { // Change this value to control when it sticks
      title.classList.add("sticky");
    } else {
      title.classList.remove("sticky");
    }
  });
  


  

