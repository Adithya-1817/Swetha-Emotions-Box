const emotionBoxes = document.querySelectorAll(".emotion-box");
const chitDisplay = document.querySelector(".chit-display");
const chitCounter = document.querySelector(".chit-counter");
const greetingDiv = document.getElementById("greeting");

// Time-based greeting
function updateGreeting() {
    const hour = new Date().getHours();
    let text = "Hello, Swetha! 💌";
    if(hour >=5 && hour <11) text = "Good Morning, Swetha! ☀️";
    else if(hour >=11 && hour <16) text = "Good Afternoon, Swetha! 🌞";
    else if(hour >=16 && hour <20) text = "Good Evening, Swetha! 🌙";
    else text = "Good Night, Swetha! 🌌";
    greetingDiv.innerText = text;
}
updateGreeting();

// Initialize chit storage
let chitStorage = JSON.parse(localStorage.getItem("chitMemory")) || {
    happy: [], sad: [], stress: [], angry_mistake: [], angry_fought: [], missing: []
};

// Map for friendly names
const friendlyNames = {
    happy: "Happy",
    sad: "Sad",
    stress: "Stress",
    angry_mistake: "Angry Cauz of Adithya's Mistake",
    angry_fought: "Angry Cauz We Fought",
    missing: "Missing Me"
};

// Chit totals per emotion
const chitTotals = {
    happy: 60,
    sad: 60,
    stress: 60,
    angry_mistake: 60,
    angry_fought: 60,
    missing: 60
};

// Update chit counter
function updateCounter() {
    chitCounter.innerHTML = Object.entries(chitStorage).map(([k,v])=>{
        return `${friendlyNames[k]}: ${v.length}/${chitTotals[k]}`;
    }).join(" | ");
}
updateCounter();

// Memory gallery modal
const galleryBtn = document.getElementById("galleryBtn");
const modal = document.getElementById("galleryModal");
const closeModal = document.querySelector(".close");
const galleryContent = document.getElementById("galleryContent");

galleryBtn.onclick = ()=> {
    galleryContent.innerHTML = "";
    for(const [emotion, chits] of Object.entries(chitStorage)){
        chits.forEach(c=>{
            const div = document.createElement("div");
            div.innerHTML = `<b>${friendlyNames[emotion]}:</b> ${c}`;
            galleryContent.appendChild(div);
        });
    }
    modal.style.display = "block";
}
closeModal.onclick = ()=> modal.style.display = "none";
window.onclick = e => { if(e.target == modal) modal.style.display = "none"; }

// Dynamic gradient background per emotion
const gradients = {
    happy: ["#FFEB3B", "#FFD700"],
    sad: ["#4CAF50", "#2E7D32"],
    stress: ["#9C27B0", "#BA68C8"],
    angry_mistake: ["#FF9800", "#FFB74D"],
    angry_fought: ["#F44336", "#E57373"],
    missing: ["#03A9F4", "#81D4FA"]
};
function changeBackground(eid){
    const grad = gradients[eid];
    document.body.style.background = `linear-gradient(135deg, ${grad[0]}, ${grad[1]})`;
}

// Fetch chit and update display
emotionBoxes.forEach(box=>{
    box.addEventListener("click", ()=>{
        const eid = box.dataset.id;
        fetch("/get_chit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ emotion_id: eid })
        })
        .then(res=>res.json())
        .then(data=>{
            chitDisplay.innerHTML = data.chit;
            chitStorage[eid].push(data.chit);
            localStorage.setItem("chitMemory", JSON.stringify(chitStorage));
            updateCounter();
            changeBackground(eid);
            sparkleEffect();
        })
        .catch(err=> alert("Network error. Check console."));
    });
});

// Sparkle canvas effect
const canvas = document.getElementById("sparkleCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
let sparkles = [];
function sparkleEffect() {
    for(let i=0;i<30;i++){
        sparkles.push({
            x: Math.random()*canvas.width,
            y: Math.random()*canvas.height,
            size: Math.random()*3+2,
            speedY: Math.random()*2+1,
            alpha: 1
        });
    }
}
function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    sparkles.forEach((s,i)=>{
        ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
        ctx.beginPath();
        ctx.arc(s.x,s.y,s.size,0,Math.PI*2);
        ctx.fill();
        s.y -= s.speedY;
        s.alpha -= 0.02;
        if(s.alpha<=0) sparkles.splice(i,1);
    });
    requestAnimationFrame(animate);
}
animate();
