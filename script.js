const tiles = document.querySelectorAll(".tile");

tiles.forEach(element => {
    element.addEventListener("mouseover", () => {
        element.querySelector("a").classList.add("color");
    });

    element.addEventListener("mouseout", () => {
        element.querySelector("a").classList.remove("color");
    });
});
