const trainerContainer = document.querySelector("#trainerContainer");
const editTrainerWin = document.querySelector("#editTrainer");
const addTrainerWin = document.querySelector("#addTrainer");
const editSend = document.querySelector("#editSend");
const formEdit = document.querySelector("#formEdit");
const addSend = document.querySelector("#addSend");
const formAdd = document.querySelector("#formAdd");
const addTrainerBtn = document.querySelector("#addTrainerBtn");

addTrainerBtn.addEventListener("click", () => {
    addTrainerWin.classList.remove("hidden");
});

addSend.addEventListener("click", () => {
    addTrainer();
    addTrainerWin.classList.add("hidden");
});

editSend.addEventListener("click", () => {
    editTrainer(formEdit.getAttribute("data-trainerId"));
    editTrainerWin.classList.add("hidden");
});

async function getTrainer() {
    const response = await fetch("http://127.0.0.1:3000/trainer", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await response.json();
    return data;
}

async function addTrainer() {
    const response = await fetch("http://127.0.0.1:3000/trainer", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: document.querySelector("#nameAdd").value,
            age: document.querySelector("#ageAdd").value,
        }),
    });
    console.log(await response.json());
    displayTrainers();
}

async function deleteTrainer(id) {
    const response = await fetch(`http://127.0.0.1:3000/trainer/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    console.log(await response.json());
    displayTrainers();
}

async function editTrainer(id) {
    const response = await fetch(`http://127.0.0.1:3000/trainer/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: document.querySelector("#nameEdit").value,
            age: document.querySelector("#ageEdit").value,
        }),
    });
    console.log(await response.json());
    displayTrainers();
}

async function detailTrainer(id) {
    const response = await fetch(`http://127.0.0.1:3000/trainer-poke/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await response.json();
    return data.pokemon;
}

async function displayTrainers() {
    trainerContainer.innerHTML = "";
    const trainer = await getTrainer();
    trainer.forEach(async (e) => {
        const article = document.createElement("article");
        const title = document.createElement("h3");
        const age = document.createElement("p");
        const modifyBtn = document.createElement("button");
        const deleteBtn = document.createElement("button");
        const detailBtn = document.createElement("button");
        const btnContainer = document.createElement("div");
        modifyBtn.innerHTML = "Modify";
        modifyBtn.addEventListener("click", () => {
            editTrainerWin.classList.remove("hidden");
            formEdit.setAttribute("data-trainerId", e._id);
        });
        deleteBtn.innerHTML = "Delete";
        deleteBtn.addEventListener("click", () => {
            deleteTrainer(e._id);
        });
        detailBtn.innerHTML = "Detail";
        detailBtn.addEventListener(
            "click",
            async () => {
                const poke = await detailTrainer(e._id);
                console.log(poke);
                poke.forEach((el, i) => {
                    const pokemon = document.createElement("div");
                    pokemon.classList.add("pokemon");

                    const pokeTitle = document.createElement("h4");
                    pokeTitle.innerHTML = `POKEMON #${i + 1}`;

                    const pokeName = document.createElement("p");
                    pokeName.classList.add("pokeName");
                    pokeName.innerHTML = "<span>Name : </span>" + el.name;

                    const pokeType = document.createElement("p");
                    pokeType.innerHTML = "<span>Type : </span>" + el.type;

                    const pokeLvl = document.createElement("p");
                    pokeLvl.innerHTML = "<span>Level : </span>" + el.level;

                    const pokeAtk = document.createElement("div");
                    const pokeAtkTitle = document.createElement("h5");
                    pokeAtkTitle.innerHTML = "Attacks :";
                    pokeAtk.appendChild(pokeAtkTitle);
                    el.attack.map((atk) => {
                        const attack = document.createElement("li");
                        attack.innerHTML = atk;
                        pokeAtk.appendChild(attack);
                    });

                    pokemon.appendChild(pokeTitle);
                    pokemon.appendChild(pokeName);
                    pokemon.appendChild(pokeType);
                    pokemon.appendChild(pokeLvl);
                    pokemon.appendChild(pokeAtk);

                    article.appendChild(pokemon);
                });
            },
            { once: true },
        );
        btnContainer.classList.add("btnContainer");
        btnContainer.appendChild(modifyBtn);
        btnContainer.appendChild(deleteBtn);
        btnContainer.appendChild(detailBtn);
        title.textContent = e.name;
        age.textContent = e.age;
        article.appendChild(title);
        article.appendChild(age);
        article.appendChild(btnContainer);
        trainerContainer.appendChild(article);
    });
}

displayTrainers();
