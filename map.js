
const stores = [
    {
        name: "Mumbai Store",
        location: "Mumbai, India",
        image: "mumbai.jpg",
        mapLink: "https://www.google.com/maps?q=Just+In+Time+Watch+Boutique+Mumbai"
    },
    {
        name: "Pune Store",
        location: "Pune, India",
        image: "pune.jpg",
        mapLink: "https://www.google.com/maps?q=Just+In+Time+Watch+Boutique+Pune"
    },
    {
        name: "Surat Store",
        location: "Surat, India",
        image: "surat.jpg",
        mapLink: " https://www.google.com/maps?q=Just+In+Time+Watch+Boutique+Surat"
    },
    {
        name: "Delhi Store",
        location: "Delhi, India",
        image: "delhi.jpg",
        mapLink: "https://www.google.com/maps?q=Just+In+Time+Watch+Boutique+Delhi"
    },
    {
        name: "Noida Store",
        location: "Noida, India",
        image: "noida.jpg",
        mapLink: " https://www.google.com/maps?q=Just+In+Time+Watch+Boutique+Noida"
    },
    {
        name: "Bangalore Store",
        location: "Bangalore, India",
        image: "bangalore.jpg",
        mapLink: "https://www.google.com/maps?q=Just+In+Time+Watch+Boutique+Bangalore"
    }

];


const storeList = document.getElementById("storeList");

stores.forEach(store => {
    const card = document.createElement("div");
    card.classList.add("store-card");

    card.innerHTML = `
        <img src="${store.image}" alt="${store.name}">
        <h3>${store.name}</h3>
        <p>${store.location}</p>
    `;

    
    card.addEventListener("click", () => {
        window.open(store.mapLink, "_blank");
    });

    storeList.appendChild(card);
    document.getElementById("goBackBtn").addEventListener("click", () => {
        window.location.href = "dashboard.html"; // Change to your dashboard page file
    });
    
});
