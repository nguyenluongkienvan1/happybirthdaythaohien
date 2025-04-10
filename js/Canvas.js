'use strict';

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66'];
const gravity = 0.02;
const friction = 0.98;
let particles = [];

// Khi resize cửa sổ
addEventListener('resize', () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});

// Particle = từng mảnh pháo hoa
class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }

  draw() {
    c.save();
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
    c.restore();
  }

  update() {
    this.draw();
    this.velocity.y *= friction;
    this.velocity.x *= friction;
    this.velocity.y += gravity;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.01; // tốc độ mờ dần
  }
}

// Random pháo hoa mỗi vài giây
function spawnFirework() {
  let x = innerWidth / 2;
  let y = innerHeight / 2;

  if (innerWidth <= 768) {
    x = randomIntFromRange(50, innerWidth - 50);
    y = randomIntFromRange(50, innerHeight - 50);
  } else {
    x = randomIntFromRange(200, innerWidth - 200);
    y = randomIntFromRange(100, innerHeight - 100);
  }

  const particleCount = 80;
  const angleIncrement = (Math.PI * 2) / particleCount;
  const power = 6;

  for (let i = 0; i < particleCount; i++) {
    particles.push(
      new Particle(
        x,
        y,
        3,
        `hsl(${Math.random() * 360}, 70%, 60%)`,
        {
          x: Math.cos(angleIncrement * i) * Math.random() * power,
          y: Math.sin(angleIncrement * i) * Math.random() * power
        }
      )
    );
  }
}

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = `rgba(0, 0, 0, 0.1)`; // hiệu ứng mờ mịn hơn
  c.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle, i) => {
    if (particle.alpha > 0) {
      particle.update();
    } else {
      particles.splice(i, 1);
    }
  });
}

function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Bắt đầu
animate();
setInterval(spawnFirework, 2500);
